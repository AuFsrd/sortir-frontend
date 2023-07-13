"use client"

import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useContext, useEffect, useState} from "react";
import {City, Event, Venue, User, Site, IRI} from "@/models/interfaces";
import {createEvent, getAllSites, updateUser} from "@/services/apiRequests";
import {useRouter} from "next/navigation";
import {UserContext} from "@/app/layout";

const schema = yup.object({

    username: yup.string().required(),
    //password: yup.string().required(),
    //confirmation: yup.string()
      //  .required('Please retype your password.')
        //.oneOf([yup.ref('password')], 'Your passwords do not match.'),

    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.string().required(),
    email: yup.string().required(),
    site: yup.string().required()
})

type UserFormReq = {
    username: string,
    //password: string,
   // confirmation: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    site: string
}

export default function ProfileForm() {
    const router = useRouter()
    const user = useContext(UserContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const [sites, setSites] = useState<Site[]>([]);
    const [selectedSite, setSelectedSite] = useState<Site|undefined>(undefined);

    useEffect(() => {
        getSites()
    }, [])

    async function getSites() {
        try {
            const data = await getAllSites();
            setSites(data);
        } catch (e) {
        } finally {
            console.log(sites)
        }
    }

    const siteField = register("site");
    const onSubmit = (data: UserFormReq) => {
        console.log(data)
        const newUser: User = {
            ...user,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            email: data.email,
            site: sites.find(item => item.name === data.site)!

            // organiser: `/api/users/${user.id}`,
        }

        console.log(newUser)
        update(newUser)
    }
    const update = async (newUser: User) => {
        const result = await updateUser(newUser);
        if (result) {
            console.log(result)
            router.replace(`/profile/${result.id}`)
        }
    }



  return (
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <div>
              <label htmlFor="Username">Pseudo</label>
              <input type="text" placeholder="Username"  {...register("username")} />
          </div>
          <p className="error">{errors.username?.message}</p>

          <div className="flex justify-between">
              <div className="w-[48%]">
                  <label htmlFor="firstName">Prénom</label>
                  <input type="text"{...register("firstName")} />
              </div>

              <div className="w-[48%]">
                  <label htmlFor="lastName">Nom</label>
                  <input type="text" value={user?.lastName} {...register("lastName")} />
              </div>
          </div>
          <p className="error">{errors.firstName?.message}</p>
          <p className="error">{errors.lastName?.message}</p>

          <div className="flex justify-between">
              <div className="w-[38%]">
                  <label htmlFor="phone">Téléphone</label>
                  <input type="text" placeholder="XXXXX" value={user?.phone} {...register("phone")} />
              </div>

              <div className="w-[58%]">
                  <label htmlFor="email">Email</label>
                  <input type="text" placeholder="xxxx@xxxx.xxx" value={user?.email} {...register("email")} />
              </div>
          </div>
          <p className="error">{errors.phone?.message}</p>
          <p className="error">{errors.email?.message}</p>

          <div>
              <label htmlFor="site">Site</label>
              <input list="sites" id="site" placeholder="ENI site" value={(user?.site as Site).name} {...register("site")}/>
          </div>
          <p className="error">{errors.site?.message}</p>

          <datalist id="sites">
              {sites.map(s => <option key={s.id} value={s.name}/>)}
          </datalist>


          <input className="mt-4" type="submit" disabled={false} value="Mettre à jour"/>

      </form>
  )
}