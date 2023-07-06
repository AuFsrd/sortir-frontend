/**
 * Fichier déclarant toutes les interfaces métier.
 */

interface Fetchable {
	id: number
	restname: string
}

export interface User extends Fetchable {
	id: number,
	username: string,
	roles: string[],
	firstName: string,
	lastName: string,
	phone: string,
	email: string,
	administrator: boolean,
	active: boolean,
	site: Site | string,
	eventsAsOrganiser: Partial<Event>[]
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
export interface Site extends Fetchable {
	id: number,
	name: string
}

export interface Event extends Fetchable {
	id: number,
	name: string,
	startDateTime: string,
	duration: number,
	registrationDeadline: string,
	maxParticipants: number,
	description: string,
	state: string | Object,
	venue: string | Object,
	organiser: string | Object,
	participants: string[] | Object[]
}