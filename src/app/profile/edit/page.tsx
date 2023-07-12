"use client"
import { UserContext } from "@/app/layout";
import {useContext, useEffect, useState} from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { EventRequestInstructions } from "@/services/requestBuilder";
import { getAllEventsBy, getAllSites } from "@/services/apiRequests";
import { Event, User, Status, Site } from "@/models/interfaces";


const schema = yup
    .object({
        name: yup.string().nullable().default(null),
        site: yup.number().nullable().transform(id => (!Number.isNaN(id) ? id : undefined)),
        startDate: yup.date().nullable().transform(d => (d instanceof Date && !isNaN(d) ? d : undefined)),
        endDate: yup.date().nullable().transform(d => (d instanceof Date && !isNaN(d) ? d : undefined)),
        organiser: yup.boolean(),
        participant: yup.boolean(),
        notParticipant: yup.boolean(),
        includePastEvents: yup.boolean()
    })

export default function ProfileForm(props: any) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const [sites, setSites] = useState<Site[]>([]);

    async function getSites() {
        try {
            const data = await getAllSites();
            setSites(data);
        } catch (e) {
        } finally {
        }
    }

    useEffect(() => {
        getSites()
    }, [])

    const onSubmit = (data: EventRequestInstructions) => {
        props.setReq(data);
        console.log("let's go "+ data)
    }
  return (
    <>
      <h1>Template</h1>
      <p>Bonjour, {user?.firstName} {user?.lastName}</p>
      <p>{variableDynamique}</p>
      <button onClick={increment}>+</button>
    </>
  )
}