import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { EventRequestInstructions } from "@/services/requestBuilder";
import { getAllEventsBy } from "@/services/apiRequests";
import { Event, User, Status } from "@/models/interfaces";

const schema = yup
  .object({
    name: yup.string().nullable().default(null),
    site: yup.number().nullable().transform(id => (!Number.isNaN(id) ? id : undefined)),
    startDate: yup.date().nullable().transform(d => (d instanceof Date && !Number.isNaN(d) ? d : undefined)),
    endDate: yup.date().nullable().transform(d => (d instanceof Date && !Number.isNaN(d) ? d : undefined)),
    userIsOrganizer: yup.boolean(),
    userIsParticipant: yup.boolean(),
    userIsNotParticipant: yup.boolean(),
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
  
  const onSubmit = (data: EventRequestInstructions) => {
      props.setReq(data);
      console.log("let's go "+ data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <div>
        <label htmlFor="name">Recherche</label>
        <input type="text" placeholder="Le nom de l'événement contient..." {...register("name")} />
        <p>{errors.name?.message}</p>
      </div> 

      <div>
        <label htmlFor="site">Site</label>
        <input type="select" {...register("site")} />
        <p>{errors.site?.message}</p>
      </div>

      <div>
        <label htmlFor="startDate">Date de début</label>
        <input type="date" {...register("startDate")} />
        <p>{errors.startDate?.message}</p>
      </div>

      <div>
        <label htmlFor="endDate">Date de fin</label>
        <input type="date" {...register("endDate")} />
        <p>{errors.endDate?.message}</p>
      </div>

      <div>
        <label htmlFor="userIsOrganizer">Événements que j'organise</label>
        <input type="checkbox" id="userIsOrganizer" {...register("userIsOrganizer")} />
      </div>

      <div>
        <label htmlFor="userIsParticipant">Événements auxquels je participe</label>
        <input type="checkbox" id="userIsParticipant" {...register("userIsParticipant")} />
      </div>

      <div>
        <label htmlFor="userIsNotParticipant">Événements auxquels je ne participe pas</label>
        <input type="checkbox" id="userIsNotParticipant" {...register("userIsNotParticipant")} />
      </div>

      <div>
        <label htmlFor="includePastEvents">Événements passés</label>
        <input type="checkbox" id="includePastEvents" {...register("includePastEvents")} />
      </div>

      <input type="submit" disabled={props.loading} />
    </form>
  )
}