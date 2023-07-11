"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import { createContext, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { loggedIn } from '@/services/auth'
import LoginForm from '@/components/LoginForm'
import { User } from '@/models/interfaces'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

/**
 * Crée un contexte UserContext qui contiendra un objet User correspondant à l'utilisateur actif)
 */
export const UserContext = createContext<User>(JSON.parse(sessionStorage.getItem("user")!));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [user, setUser] = useState<User>(JSON.parse(sessionStorage.getItem("user")!));
  const [logged, setLogged] = useState<boolean>(false);
  
  /**
   * Déclenche ce code à chaque instanciation de ce composant, et à chaque mise à jour
   * de la variable de seesion "user".
   */
  useEffect(() => {
    setLogged(loggedIn())
    setUser(JSON.parse(sessionStorage.getItem("user")!))
    console.log("Mounted!")
  }, [sessionStorage.getItem("user")])

  /**
   * Fonction pour rafraichir la page. Elle est passée aux composants gérant le login et le logout.
   */
  function refresh() {
    setLogged(loggedIn())
    setUser(user)
  }

  return (
    <html lang="fr">
      <body className={inter.className}>
      <>
      {user ? (
        <>
          <UserContext.Provider value={user}> {/* Tout ce qui est contenu dans ce provider a accès la variable de contexte */}
            <Navbar refresh={refresh} />
          <main className='flex min-h-screen max-w-2xl pt-32 flex-col m-auto items-center p-2'>
            {children}
          </main>
          </UserContext.Provider>
          <Footer />
        </>
        ) :
        <main className='flex min-h-screen flex-col max-w-2xl m-auto justify-center items-center'>
          <LoginForm refresh={refresh} />
        </main>
      }
      </>
      </body>
    </html>
  )
}
