"use client"

import { useEffect, useState } from "react"
import { getAllEventsBy } from "@/services/apiRequests";
import { EventRequestInstructions } from "@/services/requestBuilder";
import { Event, User, Status } from "@/models/interfaces";
import HomeForm from "@/components/HomeForm";
import EventBox from "@/components/EventBox";

export default function Home() {
  const [reqInstructions, setReqInstructions] = useState<EventRequestInstructions>({
    name: undefined,
    site: undefined,
    startDate: undefined,
    endDate: undefined,
    organiser: false,
    participant: false,
    notParticipant: false,
    includePastEvents: false
  })
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false);

  async function updateEvents() {
    setLoading(true);
    try {
      const data = await getAllEventsBy(reqInstructions)
      setEvents(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("Fetching...")
    updateEvents()    
  }, [reqInstructions])

  let ctr = 1; // Debug
  return (
    <>
      <h1>Rechercher une sortie</h1>
      {/* Insère le formulaire de recherche*/}
      <HomeForm loading={loading} setLoading={setLoading} req={reqInstructions} setReq={setReqInstructions} />
      {/* Insère un EventBox pour chaque event de la liste et lui passe l'objet event correspondant*/}
      {events.length ? events.map((e) => <EventBox key={e.id} __debugRow={ctr++} event={e} />) : <p>Aucun événement</p>}
    </>
  )
}
