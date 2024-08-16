import React from "react";
import Link from "next/link";
import { useRouter } from 'next/router'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form"

import { IUser } from "../../../utils/types";
import Email from "../../../components/inputs/email";
import { meAPI } from "../../../modules/auth/utils/api";
import useAuth from "../../../modules/auth/hooks/useAuth";
import Password from "../../../components/inputs/password";
import Proceed from "../../../components/button/submitButton";
import { useLogin } from "../../../modules/auth/hooks/useLogin";
import Layout from "../../../modules/auth/components/layout";
import { LoginData, loginSchema } from "../../../modules/auth/utils/validations";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


const SignIn = () => {
  const router = useRouter()
  const { setUser, } = useAuth()
  const { isPending, mutate } = useLogin()
  const methods = useForm<LoginData>({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  })

  const { register, handleSubmit } = methods
  const { errors } = methods.formState

  const onSubmit: SubmitHandler<LoginData> = (inputs) => {
    mutate(inputs, {
      onSuccess: (data) => {
        console.log(data)
        meAPI()
          .then((user) => {
            const userdata = user as IUser
            setUser && setUser(userdata)
          })
          .catch((error: unknown) => {
            const text = (error as AxiosError<{ message: string }>)?.response?.data
            const message = text?.message
            toast.error(message as string);
          })
      },
      onError: (error: unknown) => {
        const text = (error as AxiosError<{ message: string }>)?.response?.data
        const message = text?.message
        toast.error(message as string);
      },
    })
  }

  return (
    <Layout >
      <form className="h-screen w-full items-center flex justify-center" onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-5xl relative   px-4 sm:px-16 lg:px-32 w-full">
          <div className="w-full md:px-3">
            <div className="w-full  text-left">
              <h3 className="text-3xl">Sign in</h3>
            </div>
            <div className="mt-5 w-full">
              <label htmlFor="">Email</label>
              <Email register={register} errors={errors?.email} />
            </div>
            <div className="mt-5 w-full">
              <label htmlFor="">Password</label>
              <Password id="password" register={register} errors={errors?.password} />
            </div>
            <div className="mt-5 flex justify-between">
              <div className="relative   flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="comments"
                    name="comments"
                    type="checkbox"
                    aria-describedby="comments-description"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="comments" className="font-medium  cursor-pointer text-gray-900">
                    Remember me
                  </label>

                </div>
              </div>
              <div>
                <Link href="/auth/renewPassword"><h6 className="text-md">Forgotten Password</h6></Link>
              </div>
            </div>
            <div className="w-full mt-8">
              <Proceed
                type="submit"
                value={isPending ? "Signing in.." : "Sign in"}
              />
            </div>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default SignIn