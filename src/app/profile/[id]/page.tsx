"use client"


export default function Profile({ params }: { params: { id: string } }) {

  return (
    <>
      <h1>Profil {params.id}</h1>
    </>
  )
}