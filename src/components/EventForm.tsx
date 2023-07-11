"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { createEvent, getAllCities } from "@/services/apiRequests";
import { Event, City, Venue, User, Status, Site } from "@/models/interfaces";

/*
Event {
	id: number,
	name: string,
	startDateTime: string,
	duration: number,
	registrationDeadline: string,
	maxParticipants: number,
	description: string,
	status: Status | IRI, // Plus d'info à la ligne 53
	venue: Venue | IRI, // Plus d'info à la ligne 53
	organiser: Partial<User> | IRI, // Plus d'info à la ligne 53
	participants: Partial<User>[] | IRI[] // Plus d'info à la ligne 53
}
*/
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
  postalCode: yup.string().required(),
  address: yup.string().required()
})

export default function EventForm() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [cities, setCities] = useState<City[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    getCities()
  }, [])

  async function getCities() {
    try {
      const data = await getAllCities();
      setCities(data);
    } catch (e) {
    } finally {
    }
  }

  const getVenues = () => {
    console.log("Yo")
  }

  const onSubmit = (data: Partial<Event>) => {
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <div>
        <label htmlFor="name">Titre de l'événement</label>
        <input type="text" placeholder="Titre de votre événement" {...register("name")} />
      </div>

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
      <p className="error">{errors.maxParticipants?.message}</p>
      
      <div>
        <label htmlFor="city">Ville de l'événement</label>
        <select id="city" {...register("city")}>
          {cities.map(c =>
          <option key={"ven-"+c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="venue">Lieu de l'événement</label>
        <input type="list" id="venue" placeholder="Nom du lieu" {...register("venue")} />
      </div>

      <datalist id="venue">
        {venues.map(v => <option value={v.name}/>)}
      </datalist>

      <div className="flex justify-between">
        <div className="w-[26%]">
          <label htmlFor="postalCode">Code postal</label>
          <input type="text" placeholder="XXXXX" {...register("postalCode")} />
        </div>

        <div className="w-[70%]">
          <label htmlFor="address">Adresse</label>
          <input type="text" placeholder="Adresse" {...register("address")} />
        </div>
      </div>

      <div>
        <label htmlFor="name">Description de l'événement</label>
        <textarea placeholder="Décrivez votre événement" {...register("description")}></textarea>
      </div>

      <input type="submit" disabled={false} />

    </form>
  )
}