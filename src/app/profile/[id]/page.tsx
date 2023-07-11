"use client"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

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
})

export default function Profile({ params }: { params: { id: string } }) {

  return (
    <>
      <h1>Profil {params.id}</h1>
    </>
  )
}