import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { login, LoginRequest } from "@/services/auth"
import { useState } from "react"

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
    rememberme: yup.boolean()
  })
  .required()

export default function LoginForm({ refresh }: any) {

  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      await login(data);
    } catch (e) {
    } finally {
      setLoading(false)
    }
    refresh();
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Identifiant</label>
          <input type="text" {...register("username")} />
          <p>{errors.username?.message}</p>
        </div>     

        <label htmlFor="password">Mot de passe</label>
        <input type="password" {...register("password")} />
        <p>{errors.password?.message}</p>

        <label htmlFor="rememberme">Se souvenir de moi</label>
        <input type="checkbox" {...register("rememberme")} />

        <input type="submit" disabled={loading} />
      </form>
      <p>{serverError}</p>
    </div>
  )
}