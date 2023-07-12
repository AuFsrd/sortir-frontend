import { UserContext } from "@/app/layout"
import { Event, User, Status, Venue, City, Site } from "@/models/interfaces"
import Link from "next/link"
import { useContext } from "react"

type props = {
  event: Event
  __debugRow: number
}
export default function EventBox({event, __debugRow}: props) {
  const user = useContext(UserContext)

  return (
    <article>
      <Link href={`/event/${event.id}`}>
          {/*{<p>{(event.status as Partial<Status>).name} | {((event.organiser as User).site as Site).name}</p>}*/}
      <h2>{event.name}</h2>
      <h4>{(event.venue as Venue).name}</h4>
      <em>{(event.venue as Venue).street}, {((event.venue as Venue).city as City).name}</em>
      <p className="pt-4">{event.description}</p>
      </Link>
      <hr className="my-2"/>
      <h3>Participants ({event.participants.length}/{event.maxParticipants})</h3>
      <div className="flex flex-no-wrap overflow-x-scroll no-scrollbar">
        {event.participants.map(p =>
        <Link className="" href={`/profile/${(p as User).id}`}>
          <img
            key={(p as User).id+"pic"}
            className={"flex grow-1 avatar " + ((p as User).id === user.id ? "me" : "")}
            data-user={(p as User).username}
            src={`https://loremicon.com/poly/48/48/${Math.random()*99999}/png`} />
        </Link>)}
      </div>
    </article>
  )
}