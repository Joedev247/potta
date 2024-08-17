/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Email from "../../../components/inputs/email";
import Proceed from "../../../components/button/submitButton";
import Layout from "../../../modules/auth/components/layout";
import { EmailData, emailSchema } from "../../../modules/auth/utils/validations";
import { useForgotPassword } from "../../../modules/auth/hooks/useForgotPassword";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const SignUp = () => {
  const router = useRouter()
  const { isPending, mutate } = useForgotPassword()
  const methods = useForm<EmailData>({
    mode: "onChange",
    resolver: yupResolver(emailSchema),
  })

  const { register, handleSubmit } = methods
  const { errors } = methods.formState

  const onSubmit: SubmitHandler<EmailData> = (inputs) => {

    mutate(inputs.email, {
      onSuccess: (data) => {
        console.log(data)
        router.push('/auth/codeVerification')
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
              <h3 className="text-3xl">Forgot Password ? </h3>
              <p className="text-gray-400 my-2">Enter your email below, you will receive an email with instructions
                on how to reset your password in a few minutes.  You can also
                set a new password if you’ve never set one before.</p>
            </div>

            <div className="mt-5 w-full">
              <label htmlFor="">Email</label>
              <Email register={register} errors={errors?.email} />
            </div>
            <div className="w-full mt-8">
              <Proceed value={isPending ? "Sending..." : "Start Recovery"} type="submit" />
            </div>
            <div className="mt-16 flex space-x-2">
              <p className="font-thin ">You don't have an account ? </p>
              <Link className="text-blue-500" href={"/auth/register"}>Register</Link>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default SignUp