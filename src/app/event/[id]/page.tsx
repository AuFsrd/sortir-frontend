"use client"

import { getEvent } from "@/services/apiRequests";
import {useEffect, useState} from "react";
import { Event } from "@/models/interfaces";
import EventShow from "@/components/EventDisplay";
import EventDisplay from "@/components/EventDisplay";
import {useRouter} from 'next/navigation'

export default function Event({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event>()
  const router = useRouter()

  async function loadEvent() {
    try {
      const data = await getEvent(+params.id)
      setEvent(data)
    } catch (e) {
    }
  }

  useEffect(() => {
    console.log("Fetching...")
    loadEvent()
  }, [])

  return (
    <>
      {event ? <EventDisplay event={event}/> : <p>Chargement des données...</p>}
    </>
  )
}