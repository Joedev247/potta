import React, { FC, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

import Proceed from "../../../components/button/submitButton";
import VerificationInput from "react-verification-input";
import Layout from "../../../modules/auth/layout";
import { useResetPasswordConfirm } from "../../../modules/auth/hooks/useResetPasswordConfirm";
import { maskEmailAddress } from "../../../utils";

const VerificationCode: FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const { mutate, isPending } = useResetPasswordConfirm()
  const [code, setCode] = useState("")

  const sendCode = (code: string) => {
    mutate(code, {
      onSuccess: () => {
        toast.success("Password has been reset")
        localStorage.clear()
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
      <div className="h-screen w-full items-center flex justify-center">
        <div className="mx-auto max-w-5xl relative   px-4 sm:px-16 lg:px-32 w-full">
          <div className="w-full md:px-3">
            <div className="w-full  text-center">
              <h3 className="text-3xl">Enter The Verification Code</h3>
              <p className="text-gray-400 font-thin mt-3">We have just send the verification code to {maskEmailAddress(email)}</p>
            </div>
            <div className="my-8 flex justify-center w-full">
              <div>
                <VerificationInput value={code} onChange={(value) => setCode(value)} length={6} />
                <div className="flex justify-between items-center mt-5">
                  <p className="text-[#34CAA5] font-medium">Send the code Again</p>
                  <span className="cursor-default font-semibold hover:text-green-400" onClick={() => setCode("")}>Clear</span>
                </div>
                <div className="w-full mt-4">
                  <Proceed disabled={code?.length !== 6} value={isPending ? "Loading..." : "Proceed"} type="button" onclick={() => { sendCode(code) }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default VerificationCode