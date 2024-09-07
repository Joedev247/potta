/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button, Input } from "@instanvi/ui-components";
import Layout from "../../../modules/auth/layout";
import { ResetPasswordData, resetPasswordSchema } from "../../../modules/auth/utils/validations";
import { useResetPassword } from "../../../modules/auth/hooks/useResetPassword";

const ResetPasswordPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { isPending, mutate } = useResetPassword()
  const methods = useForm<ResetPasswordData>({
    mode: "onChange",
    resolver: yupResolver(resetPasswordSchema),
  })

  const { register, handleSubmit } = methods
  const { errors } = methods.formState

  const onSubmit: SubmitHandler<ResetPasswordData> = (inputs) => {
    if (!token) {
      toast.error("Invalid or No token available")
      return
    }

    const payload = {
      password: inputs.password,
      token
    }

    mutate(payload, {
      onSuccess: (data) => {
        console.log(data)
        router.push('/auth/login')
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
        <div className="mx-auto max-w-5xl relative px-4 sm:px-16 w-full xl:w-[35rem]">
          <div className="w-full md:px-3">
            <div className="w-full  text-left">
              <h3 className="text-3xl">Reset Password</h3>
              <p className="text-gray-400 my-2">
                Enter you new password and login into your account
              </p>
            </div>

            <div className="grid gap-3">
              <Input
                name="password"
                register={register}
                label="New Password"
                placeholder="Password@123"
                errors={errors?.password}
              />
              <Input
                register={register}
                name="confirm_password"
                placeholder="Password@123"
                label="ReType New Password"
                errors={errors?.confirm_password}
              />
            </div>
            <div className="w-full mt-8">
              <Button fullWidth value={isPending ? "Resting..." : "Reset password"} type="submit" />
            </div>
            <div className="mt-16 flex space-x-2">
              <p className="font-thin ">You don&#39;t have an account ? </p>
              <Link className="text-blue-500" href={"/auth/register"}>Register</Link>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default ResetPasswordPage