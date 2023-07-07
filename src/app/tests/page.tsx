"use client"
import { getAllUsers } from "@/services/apiRequests"
import { useState } from "react";
import { User, Event } from "@/models/interfaces";
import PatchForm from "@/components/PatchForm";

export default function Tests() {
  
  const [users, setUsers] = useState<User[]>([])

  async function getAll() {
    try {
      const data = await getAllUsers();
      setUsers(data);
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  }

  const usersList = users.map((user) => <p key={user.id}>{user.eventsAsOrganiser.map((e) => (e as Event).name)}</p>);

  return (
    <>
      <h1>Tests</h1>
      <PatchForm id={4} />
      <button onClick={getAll}>Get Users</button>
      {usersList}
    </>
  )
}
