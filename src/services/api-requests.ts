import { getAccessToken } from "axios-jwt";
import { client } from "./client";
import * as Entities from "@/models/interfaces";

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
 *//*
export const getAllEventsBy = async (): Promise<Entities.Event[]> => {
  const { data } = await client.get('users.json', {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}
*/

export const getEvent = async (id: number): Promise<Entities.Event> => {
  const { data } = await client.get(`events/${id}.json`, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken()
    }
  })
  return data;
}

export const updateEvent = async (event: Entities.Event): Promise<Entities.Event> => {
  const { data } = await client.patch(`events/${event.id}`, event, {
    headers: {
      'Authorization': 'Bearer '+getAccessToken(),
      'Content-Type': 'application/merge-patch+json'
    }
  })
  return data;
}

/**
 * GENERIC
 */