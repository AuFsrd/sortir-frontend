/**
 * Fichier déclarant toutes les interfaces métier.
 */

export type IRI = `/api/${string}/${number}`;

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
	site: Site,
	eventsAsOrganiser: Partial<Event>[] | IRI[],
	eventsAsParticipant: Partial<Event>[] | IRI[]
}
export interface Event {
	id: number,
	name: string,
	startDateTime: string,
	duration: number,
	registrationDeadline: string,
	maxParticipants: number,
	description: string,
	status: Status | IRI,
	venue: Venue | IRI,
	organiser: Partial<User> | IRI,
	participants: Partial<User>[] | IRI[]
}

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
	city: City | IRI
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