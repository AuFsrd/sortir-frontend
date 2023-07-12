import { UserContext } from "@/app/layout"
import { ChangeEvent, useEffect, useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { createEvent, getAllCities, getVenuesBy } from "@/services/apiRequests";
import { Event, City, Venue, User, Status, Site } from "@/models/interfaces";
import { useRouter } from 'next/navigation'

const schema = yup.object({
  name: yup.string().required(),
  startDateTime: yup.date().required(),
  duration: yup.number().positive().required(),
  registrationDeadline: yup.date().required().when(
    'startDateTime',
    (startDateTime, schema) => (startDateTime && schema.max(startDateTime)),
  ),
  maxParticipants: yup.number().positive().required(),
  description: yup.string().optional(),
  city: yup.string().required(),
  venue: yup.string().required(),
  postcode: yup.string(),
  address: yup.string().required()
})

type EventFormReq = {
  name: string,
  startDateTime: Date,
  duration: number,
  registrationDeadline: Date,
  maxParticipants: number,
  description: string|undefined,
  city: string,
  venue: string,
  postcode: string|undefined,
  address: string
}

export default function EventForm() {

  const router = useRouter()
  const user = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [cities, setCities] = useState<City[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedCity, setSelectedCity] = useState<City|undefined>(undefined);
  const [selectedVenue, setSelectedVenue] = useState<Venue|undefined>(undefined);

  useEffect(() => {
    getCities()
  }, [])

  useEffect(() => {
    selectedCity && getVenues()
  }, [selectedCity])

  async function getVenues() {
    try {
      const data = await getVenuesBy(selectedCity!.id);
      setVenues(data);
    } catch (e) {
    } finally {
    }
  }

  async function getCities() {
    try {
      const data = await getAllCities();
      setCities(data);
    } catch (e) {
    } finally {
    }
  }

  const selectCity = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(cities.find(c => c.id === +e.currentTarget.value));
  }

  const selectVenue = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedVenue(venues.find(v => v.name === e.currentTarget.value));
  }

  const cityField = register("city");
  const venueField = register("venue");

  const onSubmit = (data: EventFormReq) => {
    console.log(data)
    let venue: Venue | undefined = venues.find(v => v.name === data.venue);

    if (!venue) {
      console.log("La venue n'existe pas")
      venue = {
        id: 0,
        name: data.venue,
        street: data.address,
        city: `/api/cities/${+data.city}`
      }
    } else {
      console.log("La venue existe")
    }
    console.log(venue)

    const newEvent: Partial<Event> = {
      name: data.name,
      startDateTime: data.startDateTime.toISOString(),
      duration: data.duration,
      registrationDeadline: data.registrationDeadline.toISOString(),
      maxParticipants: data.maxParticipants,
      description: data.description,
      status: `/api/statuses/2`,
      venue: venue,
      organiser: `/api/users/${user.id}`,
      participants: []
    }

    console.log(newEvent)
    create(newEvent)
  }

  const create = async (newEvent: Partial<Event>) => {
      const result = await createEvent(newEvent);
      if (result) {
        console.log(result)
        router.replace(`/event/${result.id}`)
      }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <div>
        <label htmlFor="name">Titre de l'événement</label>
        <input type="text" placeholder="Titre de votre événement" {...register("name")} />
      </div>
      <p className="error">{errors.name?.message}</p>

      <div className="flex justify-between">
        <div className="w-[48%]">
          <label htmlFor="startDateTime">Date et heure de début</label>
          <input type="datetime-local" {...register("startDateTime")} />
        </div>

        <div className="w-[48%]">
          <label htmlFor="registrationDeadline">Fin des inscriptions</label>
          <input type="datetime-local" {...register("registrationDeadline")} />
        </div>
      </div>
      <p className="error">{errors.startDateTime?.message}</p>
      <p className="error">{errors.registrationDeadline?.message}</p>

      <div className="flex justify-between">
        <div className="w-[48%]">
          <label htmlFor="duration">Durée (minutes)</label>
          <input type="number" {...register("duration")} />
        </div>

        <div className="w-[48%]">
          <label htmlFor="maxParticipants">Nombre de participants</label>
          <input type="number" {...register("maxParticipants")} />
        </div>
      </div>
      <p className="error">{errors.duration?.message}</p>
      <p className="error">{errors.maxParticipants?.message}</p>
      
      <div>
        <label htmlFor="city">Ville de l'événement</label>
        <select id="city" {...cityField} onChange={(e) => {selectCity(e); cityField.onChange(e)}}>
          {cities.map(c =>
          <option key={"ven-"+c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <p className="error">{errors.city?.message}</p>
      
      <div>
        <label htmlFor="venue">Lieu de l'événement</label>
        <input list="venues" id="venue" placeholder="Nom du lieu" {...venueField} onChange={(e) => {selectVenue(e); venueField.onChange(e)}} />
      </div>
      <p className="error">{errors.venue?.message}</p>

      <datalist id="venues">
        {venues.map(v => <option key={v.id} value={v.name}/>)}
      </datalist>

      <div className="flex justify-between">
        <div className="w-[26%]">
          <label htmlFor="postcode">Code postal</label>
          <input type="text" placeholder="XXXXX" disabled={true} value={selectedCity?.postcode} {...register("postcode")} />
        </div>

        <div className="w-[70%]">
          <label htmlFor="address">Adresse</label>
          <input type="text" placeholder="Adresse" value={selectedVenue?.street} {...register("address")} />
        </div>
      </div>
      <p className="error">{errors.postcode?.message}</p>
      <p className="error">{errors.address?.message}</p>

      <div>
        <label htmlFor="name">Description de l'événement</label>
        <textarea placeholder="Décrivez votre événement" {...register("description")}></textarea>
      </div>
      <p className="error">{errors.description?.message}</p>

      <input type="submit" disabled={false} />
      <p>{errors ? "true" : "false"}</p>
    </form>
  )
}