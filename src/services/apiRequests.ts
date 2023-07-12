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

/**
 * Méthode en charge de créer un Event
 * Cette méthode vérifie que la venue existe avant de créer l'event. Si elle n'existe pas,
 * elle la créera au préalable.
 * @param event 
 * @returns 
 */
export const createEvent = async (event: Partial<Entities.Event>): Promise<Entities.Event> => {
  if (! await getVenue((event.venue as Entities.Venue).id)) { // Code marche probablement pas.
    await createVenue((event.venue as Entities.Venue));
  };
  const { data } = await client.post(
    `events/`,
    {...event,
      status: `${baseURL}statuses/${(event.status as Entities.Status).id}`,
      venue: `${baseURL}venues/${(event.venue as Entities.Venue).id}`,
      organiser: `${baseURL}users/${(event.organiser as Entities.User).id}`,
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
    `venues/`,
    {...venue,
      city: `${baseURL}cities/${(venue.city as Entities.City).id}`,
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
  console.log(data)
  return data;
}