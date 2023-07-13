"use client"
import { UserContext } from "@/app/layout";
import { useEffect, useContext, useState } from "react";
import { getUser} from "@/services/apiRequests";
import {Event, User} from "@/models/interfaces";
import EventBox from "@/components/EventBox";
import ProfileBox from "@/components/ProfileBox";

export default function Profile({ params }: {params: {id:string}}) {
    /**
     * Effectuer ici tous les traitements nécessaires à l'affichage dont cette page est responsable.
     * Ne pas hésiter à recourir à des composants pour tout élément/pattern qui se répète où
     * pour extraire un module complexe, comme un formulaire.
     */

    //...

    /**
     * Pour utiliser des informations du user actif, utiliser ce hook.
     */
    const user = useContext(UserContext);
    // const [events, setEvents] = useState<Event[]>([])

    /**
     * Pour afficher des éléments dynamiques (qui se refraichiront tous seuls quand une variable change)
     * utiliser le hook useState. La première valeur du tableau est la variable, le second son setter à
     * utiliser pour chaque changement.
     */
    const [displayedUser, setUser] = useState<User>()

    async function loadUser() {
        try {
            const data = await getUser(+params.id)
            setUser(data)
        } catch (e) {

        }
    }
    /**
     * Pour déclencher des fonctions au rendering du composant, utiliser useEffect.
     */
    useEffect(() => {
        console.log("Fetching...")
        loadUser()
    }, [])

    /**
     * Elements à retourner au format JSX. On peut appeler des variables définies plus haut
     */
    return (
        <>
            {displayedUser ? <ProfileBox displayedUser={displayedUser}/> : <p>Chargement en cours.</p>}
        </>

    )
}