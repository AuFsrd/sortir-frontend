"use client"
import EventForm from "@/components/EventForm"

export default function EditEvent({ params }: { params: { id: string } }) {

  return (
    <>
      <h1>Event {params.id}</h1>
      <EventForm context="edit" eventId={+params.id} />
    </>
  )
}