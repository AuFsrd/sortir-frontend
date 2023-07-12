"use client"

import {UserContext} from "@/app/layout"
import {City, Event, Site, Status, STATUS, User, Venue} from "@/models/interfaces"
import {client} from "@/services/client";
import Link from "next/link"
import {useRouter} from 'next/navigation'
import {useContext} from "react"
import {getAccessToken} from "axios-jwt";
import {setEventStatus} from "@/services/apiRequests";

type props = {
  event: Event
}
export default function EventDisplay({event}: props) {
  const user = useContext(UserContext)
  const router = useRouter()

  console.log(event.participants)

  function isParticipant() {
    return event.participants.find(p => p.id == user.id);
  }

  const register = async (event: Partial<Event>, userId: number, register: boolean): Promise<Event> => {
    let participants = event.participants;
    let participantsIRIs = participants?.map(e => {
      try {
        return `/api/users/${(e as Partial<User>).id}`
      } finally {
      }
    })
    console.log(participantsIRIs)
    if (register) {
      participantsIRIs?.push((`/api/users/${userId}` as IRI));
    } else {
      participantsIRIs?.splice(participantsIRIs.indexOf(`/api/users/${userId}` as IRI));
    }
    const {data} = await client.patch(
      `events/${event.id}`,
      {
        participants: participantsIRIs
      }, {
        headers: {
          'Authorization': 'Bearer ' + getAccessToken(),
          'Content-Type': 'application/merge-patch+json',
          'Accept': 'application/json'
        }
      })
    return data;
  }

  function str2date(date: string) {
    return new Date(date);
  }

  function formatDate(date: Date) {
    const locale = 'fr-FR';
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return date.toLocaleDateString(locale, options) + ' à ' + date.toLocaleTimeString(locale);
  }

  function formatStrDate(date: string) {
    return formatDate(str2date(date));
  }

  function endDate(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);
    return formatDate(date);
  }

  return (
    <section>
      <h1>{event.name}</h1>

      <p className="pt-4">{event.description}</p>

      <h3>Lieu</h3>
      <p>{(event.venue as Venue).name}</p>
      <em>{(event.venue as Venue).street}, {((event.venue as Venue).city as City).name}</em>

      <h3>Organisé par</h3>
      <Link className="" href={`/profile/${(event.organiser as User).id}`}>
        {(event.organiser as User).firstName} {(event.organiser as User).lastName} ({(event.organiser as User).username})
      </Link>

      <h3>Site de l'organisateur</h3>
      {((event.organiser as User).site as Site).name}

      <h3>Commence le</h3>
      <p>{formatStrDate(event.startDateTime)}</p>

      <h3>Se termine le</h3>
      <p>{endDate(str2date(event.startDateTime), +(event.duration))}</p>

      {/*inscription*/}
      {(event.status as Status).name == 'OPEN' &&
        <>
          <h3>Inscription possible jusqu'au</h3>
          <p>{formatStrDate(event.registrationDeadline)}</p>
          <em>(dans la limite des places disponibles : {event.maxParticipants})</em>
        </>
      }

      {(event.status as Status).name == 'CLOSED' &&
        <h3>Les inscriptions sont closes</h3>
      }

      <hr className="my-2"/>

      <h3>Participants ({event.participants.length}/{event.maxParticipants})</h3>
      <div className="">
        {event.participants.map(p =>
          <Link className="" href={`/profile/${(p as User).id}`}>
            {(p as User).firstName} {(p as User).lastName} ({(p as User).username})<br/>
          </Link>)}
      </div>

      {isParticipant() &&
        <button className="mb-4" onClick={() => register(event, user.id, false)}>Je me désiste</button>
      }
      <br/>
      <br/>

      {(event.status as Status).name == 'OPEN' && !isParticipant() &&
        <button className="mb-4" onClick={() => register(event, user.id, true)}>Je m'inscris</button>
      }

      {(event.organiser as User).id == user.id && (event.status as Status).name == 'CREATED' &&
        <>
          <button className="mb-4" onClick={() => setEventStatus(event, STATUS.OPEN)}>Je publie l'événement</button>
          <button className="mb-4" onClick={() => router.push('/edit')}>Je modifie l'événement</button>
        </>
      }
    </section>
  )
}
