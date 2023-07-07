/**
 * Fichier déclarant toutes les interfaces métier.
 */

/**
 * L'IRI (Internationalized Resource Identifier) est une URL permettant
 * d'identifier une ressource. Dans notre API, une IRI est un moyen de pointer
 * vers une occurrence d'entité précise. C'est la manière la plus simple de
 * gérer les relations dans un requête API.
 * 
 * Le type défini ci-dessous est un type custom qui hérite d'un string
 * mais qui doit suivre un pattern précis.
 */
export type IRI = `/api/${string}/${number}`;

/**
 * L'interface User est le contrat que doivent respecter les objets JavaScript
 * qui représente l'entité User. Un objet de type User *doit* comporter toutes ces clés.
 */
export interface User {
	id: number,
	username: string,
	roles: string[],
	firstName: string,
	lastName: string,
	phone: string,
	email: string,
	administrator: boolean,
	active: boolean,
	site: Site | IRI, // Plus d'info à la ligne 50
	eventsAsOrganiser: Partial<Event>[] | IRI[], // Plus d'info à la ligne 50
	eventsAsParticipant: Partial<Event>[] | IRI[] // Plus d'info à la ligne 50
}

/**
 * Interface représentant les Events
 */
export interface Event {
	id: number,
	name: string,
	startDateTime: string,
	duration: number,
	registrationDeadline: string,
	maxParticipants: number,
	description: string,
	status: Status | IRI, // Plus d'info à la ligne 50
	venue: Venue | IRI, // Plus d'info à la ligne 50
	organiser: Partial<User> | IRI, // Plus d'info à la ligne 50
	participants: Partial<User>[] | IRI[] // Plus d'info à la ligne 50
}

/**
 * Selon le contexte, il est possible de référencer certaines entités de deux manières:
 * soit par un objet, soit par une IRI.
 * 
 * Les IRI sont pratiques pour communiquer avec l'API, mais dans notre code, il ne nous est pas
 * possible d'appeler les attributs des relations (ex: event.organiser.username : pas possible avec
 * une IRI car l'attribut "event.organiser" est une string)
 * 
 * On utilise le générique Partial<T> pour spécifier que nos objets-relations peuvent être incomplets,
 * au sens où tous les attributs déclarés dans l'interface ne sont pas nécessairement renseignés. Cela nous permet
 * d'éviter les références circulaires.
 * 
 * Exemple d'objet User valide :
 * 
 * octavia = {
 *  id: 40
 * 	username: "oct4vi4"
 *	roles: ["ROLE_ADMIN", "ROLE_USER"]
 * 	firstName: "Octavia"
 * 	lastName: "Ferrata"
 * 	phone: 555-1234
 * 	email: octavia@mail.fr
 * 	administrator: true
 * 	active: true
 * 	site: /api/sites/2 (IRI)
 * 	eventsAsOrganiser: ["/api/events/2", "/api/events/4"] // IRI[]
 *  eventsAsParticipant: [{id: 3, name: "My Cool Event"}, {id: 5}] // Partial<Event>[]
 * }
 * 
 * Dans la pratique, on travaillera quasiment tout le temps avec des Partial<T>. Les IRI sont générés
 * au moment des fetchs dans le fichier apiRequests.ts
 */

export interface Site {
	id: number,
	name: string
}

export interface Status {
	id: number,
	name: string
}

export interface Venue {
	id: number,
	name: string,
	street: string,
	city: City | IRI // Plus d'info à la ligne 50
}

export interface City {
	id: number,
	name: string,
	postcode: string
}



/*
export class User {
	id: number;
	username: string;
	roles: string[];
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	administrator: boolean;
	active: boolean;
	site: Site|string;
	eventsAsOrganiser: Partial<Event>[];
	
	constructor(data: User) {
		this.id = data.id
		this.username = data.username
		this.roles = data.roles
		this.firstName = data.firstName
		this.lastName = data.lastName
		this.phone = data.phone
		this.email = data.email
		this.administrator = data.administrator
		this.active = data.active
		this.site = data.site
		this.eventsAsOrganiser = data.eventsAsOrganiser
	}

	getIri() {
		return process.env.NEXT_PUBLIC_SERVER_URL+"users/"+this.id
	}
}
*/