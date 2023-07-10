"use client"
import Link from "next/link"
import { logout } from "@/services/auth"
import { useContext, useState } from "react";
import { UserContext } from "@/app/layout";

export default function Navbar({ refresh }: any) {
  const user = useContext(UserContext);
  const [menu, setMenu] = useState(false);

  function handleLogout() {
    logout();
    refresh();
  }

  const toggleMenu = () => {
    setMenu(prevState => !prevState)
  }
  
  return (
    <header>
      <Link href="/"><p className="logo leading-10"><span>eni</span>Sortir</p></Link>
      {user && <p>Bienvenue, {user.username}</p>}
      <button onClick={toggleMenu} className="burger-btn">
        <div className="burger"></div>
      </button>
      <nav className={"menu-"+menu}>
        <ul>
          <li><Link href="/event/new">Créer un event</Link></li>
          <li><Link href="/profile">Mon profil</Link></li>
          <li><Link href="/tests">Tests</Link></li>
          <li><Link href="/template">Template</Link></li>
          {user.administrator &&
          <li><Link href="http://localhost:8000/" target="_blank">Portail admin</Link></li>}
          <li><button onClick={handleLogout}>Logout</button></li>         
        </ul>        
      </nav>
    </header>
  )
}