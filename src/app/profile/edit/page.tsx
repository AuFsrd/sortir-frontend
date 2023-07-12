"use client"

import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import {City, Event, Venue, User, Site, IRI} from "@/models/interfaces";
import {getAllSites} from "@/services/apiRequests";

const schema = yup.object({

    username: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.string().required(),
    email: yup.string().required(),
    site: yup.string().required()
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

    useEffect(() => {
        getAllSites()
    }, [])

    async function getCities() {
        try {
            const data = await getAllSites();
            setSites(data);
        } catch (e) {
        } finally {
        }
    }

    const onSubmit = (data: Partial<Event>) => {
    }

  return (
    <>
      <h1>Template</h1>

    </>
  )
}