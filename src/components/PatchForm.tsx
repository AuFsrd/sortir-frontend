import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState, useEffect } from "react"
import { updateUser, getUser } from "@/services/apiRequests"
import { User, Site } from "@/models/interfaces"

const schema = yup
  .object({
    username: yup.string().required()
  })
  .required()

type props = {
  id: number;
};
export default function PatchForm( { id }: props) {

  const [serverError, setServerError] = useState<string>("");
  let userData: User;

  async function getUserData() {
    try {
      const data = await getUser(id);
      userData = data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserData();
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const onSubmit = (data: Partial<User>) => {
    updateUser({...userData, ...data});
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input {...register("username")} />
          <p>{errors.username?.message}</p>
        </div>
        <input type="submit" />
      </form>
      <p>{serverError}</p>
    </div>
  )
}