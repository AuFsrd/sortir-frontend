import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { EventRequestInstructions } from "@/services/requestBuilder";
import { getAllEventsBy, getAllSites } from "@/services/apiRequests";
import { Event, User, Status, Site } from "@/models/interfaces";

const schema = yup
  .object({
    name: yup.string().nullable().default(null),
    site: yup.number().nullable().transform(id => (!Number.isNaN(id) ? id : undefined)),
    startDate: yup.date().nullable().transform(d => (d instanceof Date && !isNaN(d) ? d : undefined)),
    endDate: yup.date().nullable().transform(d => (d instanceof Date && !isNaN(d) ? d : undefined)),
    organiser: yup.boolean(),
    participant: yup.boolean(),
    notParticipant: yup.boolean(),
    includePastEvents: yup.boolean()
  })

export default function HomeForm(props: any) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [sites, setSites] = useState<Site[]>([]);
  
  async function getSites() {
    try {
      const data = await getAllSites();
      setSites(data);
    } catch (e) {
    } finally {
    }
  }

  useEffect(() => {
    getSites()
  }, [])
  
  const onSubmit = (data: EventRequestInstructions) => {
      props.setReq(data);
      console.log("let's go "+ data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <div>
        <label htmlFor="name">Recherche</label>
        <input type="text" placeholder="Le nom de l'événement contient..." {...register("name")} />
      </div> 

      <div>
        <label htmlFor="site">Site</label>
        <select id="site" {...register("site")} >
          <option key={0} value={undefined}>-- Choisir un site --</option>
          {sites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
        </select>
      </div>

      <div className="flex justify-between">
        <div className="w-[48%]">
          <label htmlFor="startDate">Après le</label>
          <input type="date" {...register("startDate")} />
        </div>

        <div className="w-[48%]">
          <label htmlFor="endDate">Avant le</label>
          <input type="date" {...register("endDate")} />
        </div>
      </div>

      <div>
        <input className="mr-2" type="checkbox" id="organiser" {...register("organiser")} />
        <label htmlFor="organiser">Événements que j'organise</label>
      </div>

      <div>
        <input className="mr-2" type="checkbox" id="participant" {...register("participant")} />
        <label htmlFor="participant">Événements auxquels je participe</label>
      </div>

      <div>
        <input className="mr-2" type="checkbox" id="notParticipant" {...register("notParticipant")} />
        <label htmlFor="notParticipant">Événements auxquels je ne participe pas</label>
      </div>

      <div>
        <input className="mr-2" type="checkbox" id="includePastEvents" {...register("includePastEvents")} />
        <label htmlFor="includePastEvents">Événements passés</label>
      </div>

      <input type="submit" disabled={props.loading} />
    </form>
  )
}