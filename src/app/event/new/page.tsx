"use client"
import EventForm from "@/components/EventForm"

export default function NewEvent() {

  return (
    <>
      <h1>Nouvel événement</h1>
      <EventForm context="new" eventId={undefined} />
    </>
  )
}
