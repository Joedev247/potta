import React, { FC, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

import Proceed from "../../../components/button/submitButton";
import VerificationInput from "react-verification-input";
import Layout from "../../../modules/auth/components/layout";
import { useResetPasswordConfirm } from "../../../modules/auth/hooks/useResetPasswordConfirm";
import { maskEmailAddress } from "../../../utils";

const VerificationCode: FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [code, setCode] = useState("")
  const { mutate, isPending } = useResetPasswordConfirm()

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
            <div className="my-16 flex justify-center w-full">
              <div>
                <div>
                  <VerificationInput value={code} onChange={(value) => setCode(value)} length={5} />
                </div>
                <div className="flex justify-between items-center mt-5">
                  <p className="text-[#34CAA5] font-medium">Send the code Again</p>
                  <span className="cursor-default font-semibold" onClick={() => setCode("")}>Clear</span>
                </div>
              </div>
            </div>
            <div className="w-full mt-8">
              <Proceed disabled={code?.length !== 5} value={isPending ? "Loading..." : "Proceed"} type="button" onclick={() => { sendCode(code) }} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default VerificationCode