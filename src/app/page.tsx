"use client"

import { useEffect, useState } from "react"
import { getAllEventsBy } from "@/services/api-requests";
import { EventRequestInstructions } from "@/services/requestBuilder";
import { Event, User } from "@/models/interfaces";

export default function Home() {
  const [reqInstructions, setReqInstructions] = useState<EventRequestInstructions>({
    name: undefined,
    site: undefined,
    startDate: undefined,
    endDate: undefined,
    userIsOrganizer: false,
    userIsParticipant: false,
    userIsNotParticipant: false,
    includePastEvents: false
  })
  const [events, setEvents] = useState<Event[]>([])

  const toggleUserIsOrganizer = () => setReqInstructions(prevState => ({
      ...prevState,
      userIsOrganizer: !prevState.userIsOrganizer,
  }))

  const toggleUserIsParticipant = () => setReqInstructions(prevState => ({
    ...prevState,
    userIsParticipant: !prevState.userIsParticipant,
}))

const toggleUserNotParticipant = () => setReqInstructions(prevState => ({
  ...prevState,
  userIsNotParticipant: !prevState.userIsNotParticipant,
}))

  async function updateEvents() {
    const data = await getAllEventsBy(reqInstructions)
    setEvents(data);
  }

  useEffect(() => {
    console.log("Fetching...")
    updateEvents()    
  }, [reqInstructions])

  let ctr = 1;
  return (
    <>
      <h1>Hello</h1>
      <button onClick={toggleUserIsOrganizer}>Événements que j'organise</button>
      <button onClick={toggleUserIsParticipant}>Événements auxquels je participe</button>
      <button onClick={toggleUserNotParticipant}>Événements auxquels je ne participe pas</button>
      {events.map((e) =>
      <p key={e.id}> {ctr++}<b>Participants:</b> {(e.participants as User[]).map((e) => (e).username+' ')}, <b>organiseur:</b> {(e.organiser as User).username}</p>)}
    </>
  )
}
