import { getAccessToken } from "axios-jwt";
import { client } from "./client";
import * as Entities from "@/models/interfaces";
import { EventRequestInstructions, RequestInstructor } from "./requestBuilder";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL

/* USERS */
export const getAllUsers = async (): Promise<Entities.User[]> => {
  const { data } = await client.get('users.json', {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

export const getUser = async (id: number): Promise<Entities.User> => {
  const { data } = await client.get(`users/${id}.json`, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

export const updateUser = async (user: Entities.User): Promise<Entities.User> => {
  const { data } = await client.patch(
    `users/${user.id}`,
    {...user,
      site: `${baseURL}sites/${(user.site as Entities.Site).id}`,
      eventsAsOrganiser: (user.eventsAsOrganiser as Entities.Event[]).map((e) => `${baseURL}events/${e.id}`),
      eventsAsParticipant: (user.eventsAsParticipant as Entities.Event[]).map((e) => `${baseURL}events/${e.id}`),
    }, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken(),
      'Content-Type': 'application/merge-patch+json'
    }
  })
  return data;
}
/**
 * EVENTS
 */
export const getAllEvents = async (): Promise<Entities.Event[]> => {
  const { data } = await client.get('events.json', {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

/**
 * 
 * @TODO getAllEventsBy ?
 */
export const getAllEventsBy = async (request: EventRequestInstructions): Promise<Entities.Event[]> => {
  const { data } = await client.get(
    RequestInstructor.instance.makeEventRequest(request), {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

export const getAllEventsByOrganiser = async (userId: number): Promise<Entities.Event[]> => {
  const { data } = await client.get(
    `events.json?organiser=${userId}`, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

export const getEvent = async (id: number): Promise<Entities.Event> => {
  const { data } = await client.get(`events/${id}.json`, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

export const updateEvent = async (event: Partial<Entities.Event>): Promise<Entities.Event> => {
  const { data } = await client.patch(
    `events/${event.id}`,
    {...event,
      status: `${baseURL}statuses/${(event.status as Entities.Status).id}`,
      venue: `${baseURL}venues/${(event.venue as Entities.Venue).id}`,
      organiser: `${baseURL}users/${(event.organiser as Entities.User).id}`,
      participants: (event.participants as Entities.User[]).map((u) => `${baseURL}users/${u.id}`),
    }, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken(),
      'Content-Type': 'application/merge-patch+json'
    }
  })
  return data;
}

export const setEventStatus = async (event: Partial<Entities.Event>, statusId: Entities.STATUS): Promise<Entities.Event> => {
  const { data } = await client.patch(
    `events/${event.id}`,
    {...event,
      status: `${baseURL}statuses/${statusId}`
    }, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken(),
      'Content-Type': 'application/merge-patch+json'
    }
  })
  return data;
}

const register = async (event: Partial<Entities.Event>, userId: number, register: boolean): Promise<Entities.Event> => {
  let participants = event.participants;
  let participantsIRIs = participants?.map(e => {
    try {
      return `/api/users/${(e as Partial<Entities.User>).id}`
    } finally {
    }
  })
  console.log(participantsIRIs)
  if (register) {
    participantsIRIs?.push((`/api/users/${userId}` as Entities.IRI));
  } else {
    participantsIRIs?.splice(participantsIRIs.indexOf(`/api/users/${userId}` as Entities.IRI));
  }
  const {data} = await client.patch(
    `events/${event.id}`,
    {
      participants: participantsIRIs
    }, {
      headers: {
        'Authorization': 'Bearer ' + getAccessToken(),
        'Content-Type': 'application/merge-patch+json',
        'Accept': 'application/json'
      }
    })
  return data;
}

/**
 * Méthode en charge de créer un Event
 * Cette méthode vérifie que la venue existe avant de créer l'event. Si elle n'existe pas,
 * elle la créera au préalable.
 * @param event 
 * @returns 
 */
export const createEvent = async (event: Partial<Entities.Event>): Promise<Entities.Event> => {
  console.log("Creating event...")
  let newEvent = event
  if ((event.venue as Partial<Entities.Venue>)!.id === 0) {
    console.log("Creating venue...")
    const newVenue = await createVenue((event.venue as Partial<Entities.Venue>)!)
    newEvent.venue = newVenue;
  }

  const { data } = await client.post(
    `events`,
    {...newEvent,
      venue: `/api/venues/${(newEvent.venue as Entities.Venue).id}`,
    }, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken(),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  console.log("Created: "+data)
  return data;
}

/**
 * SITES
 */
export const getAllSites = async (): Promise<Entities.Site[]> => {
  const { data } = await client.get('sites.json', {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

/**
 * VENUES
 */
export const getVenue = async (id: number): Promise<Entities.Venue> => {
  const { data } = await client.get(`venues/${id}.json`, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

export const getVenuesBy = async (id:number): Promise<Entities.Venue[]> => {
  const { data } = await client.get(`venues.json?city=${id}`, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

export const getAllVenues = async (): Promise<Entities.Venue[]> => {
  const { data } = await client.get('venues.json', {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

export const createVenue = async (venue: Partial<Entities.Venue>): Promise<Entities.Venue> => {
  const { data } = await client.post(
    `venues`,
    {
      name: venue.name,
      street: venue.street,
      city: venue.city,
    }, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken(),
      'Content-Type': 'application/json'
    }
  })
  console.log("Created: "+data)
  return data;
}

/**
 * CITIES
 */
export const getAllCities = async (): Promise<Entities.City[]> => {
  const { data } = await client.get('cities.json', {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}