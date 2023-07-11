"use client"

export default function Event({ params }: { params: { id: string } }) {

  return (
    <>
      <h1>Event {params.id}</h1>
    </>
  )
}