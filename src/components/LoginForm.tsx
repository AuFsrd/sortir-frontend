import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { login, LoginRequest } from "@/services/auth"
import { useState } from "react"

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required()

export default function LoginForm({ refresh }: any) {

    const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const onSubmit = async (data: LoginRequest) => {
    await login(data);
    refresh();
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Identifiant</label>
          <input {...register("username")} />
          <p>{errors.username?.message}</p>
        </div>     

        <label htmlFor="password">Mot de passe</label>
        <input type="password" {...register("password")} />
        <p>{errors.password?.message}</p>

        <input type="submit" />
      </form>
      <p>{serverError}</p>
    </div>
  )
}