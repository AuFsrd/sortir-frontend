import { Event, User, Status, Venue, City, Site } from "@/models/interfaces"

type props = {
  event: Event
  __debugRow: number
}
export default function EventBox({event, __debugRow}: props) {
  return (
    <article>
      <code>{__debugRow} | {(event.status as Partial<Status>).name} | {((event.organiser as User).site as Site).name}</code>
      <h2>{event.name}</h2>
      <h4>{(event.venue as Venue).name}</h4>
      <em>{(event.venue as Venue).street}, {((event.venue as Venue).city as City).name}</em>
      <p>{event.description}</p>
      <hr className="my-2"/>
      <h3>Participants ({event.participants.length}/{event.maxParticipants})</h3>
      <div className="flex no-wrap overflow-x-scroll">        
        {event.participants.map(p =>
        <img className="avatar" data-user={(p as User).username} src={`https://loremicon.com/poly/48/48/${Math.random()*99999}/png`} />)}
      </div>
    </article>
  )
}