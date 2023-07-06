"use client"
import { UserContext } from "@/app/layout";
import { useContext, useState } from "react";

export default function Template() {
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

  /**
   * Pour afficher des éléments dynamiques (qui se refraichiront tous seuls quand une variable change)
   * utiliser le hook useState. La première valeur du tableau est la variable, le second son setter à
   * utiliser pour chaque changement.
   */
  const [variableDynamique, setVariableDynamique] = useState(1)
  function increment() {
    setVariableDynamique(variableDynamique+1);
  }

  /**
   * Pour déclencher des fonctions au rendering du composant, utiliser useEffect.
   */


  /**
   * Elements à retourner au format JSX. On peut appeler des variables définies plus haut
   */
  return (
    <>
      <h1>Template</h1>
      <p>Bonjour, {user?.firstName} {user?.lastName}</p>
      <p>{variableDynamique}</p>
      <button onClick={increment}>+</button>
    </>
  )
}