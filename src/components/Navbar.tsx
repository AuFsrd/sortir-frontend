"use client"
import Link from "next/link"
import { logout } from "@/services/auth"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/layout";
import {User} from "@/models/interfaces";

export default function Navbar({ refresh }: any) {
  const user = useContext(UserContext);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setMenu(false)
  }, [])

  function handleLogout() {
    logout();
    closeMenu();
    refresh();
  }

  const toggleMenu = () => {
    setMenu(prevState => !prevState)
  }

  const closeMenu = () => {
    setMenu(false)
  }
  
  return (
    <header>
      <div className={menu ? "backdrop opacity-20 left-0" : "backdrop opacity-0 left-full"} onClick={closeMenu}></div>
      <Link href="/" onClick={closeMenu}><p className="logo leading-10"><span>eni</span>Sortir</p></Link>
      {user &&
      <>
      <p>Bienvenue, {user.username}</p>
      <button onClick={toggleMenu} className="burger-btn">
        <div className={menu ? "burger close" : "burger"}></div>
      </button>
      <nav className={"menu-"+menu}>
        <ul className="mt-12">
          <li><Link href="/event/new" onClick={closeMenu}>Créer un event</Link></li>
          <li><Link href={`/profile/${user.id}`} onClick={closeMenu}>Mon profil</Link></li>
          <li><Link href="/tests" onClick={closeMenu}>@Tests</Link></li>
          <li><Link href="/template" onClick={closeMenu}>@Template</Link></li>
          {user.administrator &&
          <li><Link href="http://localhost:8000/" target="_blank" onClick={closeMenu}>Portail admin</Link></li>}
          <li><button onClick={handleLogout}>Logout</button></li>         
        </ul>   
      </nav>
      </>}
    </header>
  )
}