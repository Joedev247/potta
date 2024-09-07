import React, { FC, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import VerificationInput from "react-verification-input";

import { Button } from "@instanvi/ui-components";
import { maskEmailAddress } from "../../../utils";
import Layout from "../../../modules/auth/layout";
import useAuth from "apps/superApp/src/modules/auth/hooks/useAuth";
import { useConfirmRegister } from "../../../modules/auth/hooks/useConfirmRegister";

type ComfirmData = {
  email: string,
  otp: string
}

const ComfirmRegister: FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [code, setCode] = useState("")
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const { mutate, isPending } = useConfirmRegister()

  const sendCode = (inputs: ComfirmData) => {
    mutate(inputs, {
      onSuccess: () => {
        if (!user?.organization)
          localStorage.removeItem("otp")
        toast.success("Operation successful")
        router.push('/')
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
        <div className="mx-auto max-w-5xl relative px-4 sm:px-16 lg:px-32 w-full">
          <div className="w-full md:px-3">
            <div className="w-full  text-center">
              <h3 className="text-3xl">Enter The Verification Code</h3>
              <p className="text-gray-400 font-thin mt-3">We have just send the verification code to {maskEmailAddress(email)}</p>
            </div>
            <div className="my-8 flex justify-center w-full">
              <div>
                <div>
                  <VerificationInput value={code} onChange={(value) => setCode(value)} length={6} />
                </div>
                <div className="flex justify-between items-center mt-5">
                  <p className="text-[#34CAA5] font-medium">Send the code Again</p>
                  <span className="cursor-default font-semibold" onClick={() => setCode("")}>Clear</span>
                </div>
                <div className="w-full mt-8">
                  <Button
                    fullWidth
                    type="button"
                    disabled={code?.length !== 6}
                    onClick={() => { sendCode({ email: (email as string), otp: code }) }}
                    value={isPending ? "Loading..." : "Proceed"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ComfirmRegister