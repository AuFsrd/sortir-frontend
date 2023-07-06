"use client"
import Link from "next/link"
import { logout } from "@/services/auth"
import { useContext } from "react";
import { UserContext } from "@/app/layout";
import Image from 'next/image'

export default function Navbar({ refresh }: any) {
  const user = useContext(UserContext);

  function handleLogout() {
    logout();
    refresh();
  }
  
  return (
    <header>
      <Link href="/"><Image src="/logo.png" alt="logo" width="64" height="64"/></Link>
      <nav>
        {user && <p>Bienvenue, {user.username}</p>}
        <ul>
          <li><Link href="/event/new">Créer un event</Link></li>
          <li><Link href="/profile">Mon profil</Link></li>
          <li><Link href="/tests">Tests</Link></li>
          <li><Link href="/template">Template</Link></li>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  )
}