import { UserContext } from "@/app/layout"
import { Event, User, Status, Venue, City, Site } from "@/models/interfaces"
import Link from "next/link"
import {useContext, useEffect, useState} from "react"
import EventBox from "@/components/EventBox";
import {getAllEventsBy, getAllEventsByOrganiser, getEvent, getUser} from "@/services/apiRequests";

type props = {
  displayedUser: User,
}

export default function ProfileBox({displayedUser}: props) {
  const user = useContext(UserContext)

    let ctr = 1; // Debug
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false);

    async function updateEvents() {
        setLoading(true);
        try {
            const data = await getAllEventsByOrganiser(displayedUser.id)
            setEvents(data);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("Fetching...")
        updateEvents()
    }, [])


  return (
      <>
    <article>

      <h2>{displayedUser.username}</h2>
      <h4>{displayedUser.firstName}</h4>

      <h4>{displayedUser.lastName}</h4>
      <h4>{displayedUser.phone}</h4>
      <h4>{displayedUser.email}</h4>
      <h4>{(displayedUser.site as Site).name}</h4>
        {(displayedUser.id == user.id) &&
            <button className="mt-3"><Link href={`/profile/edit`}>Modifier</Link></button>
        }
        </article>

          {events.length ? events.map((e ) => <article> <EventBox key={(e as Event).id} event={e as Event} __debugRow={ctr++} /></article>) : <p>Aucun événement</p>}


      </>
  )
}