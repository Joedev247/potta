import React from "react";
import { useRouter } from "next/router";
import SuccessIcon from "../../../components/icons/sucessIcon/verification";
import { Button } from "@instanvi/ui-components";

const SuccessVerification = () => {
  const router = useRouter()

  //========== Component ==========
  return (
    <div className="h-screen w-full flex justify-center items-center ">
      <div className="mx-auto w-full flex max-w-4xl items-center justify-between p-6 lg:px-8">
        <div className="w-full">
          <div className="w-full mt-6  flex justify-center items-center h-full ">
            <div className="w-full">
              <div className="w-full flex justify-center items-center h-[40vh] border p-8 ">
                <div>
                  <div className="flex justify-center w-full">
                    <SuccessIcon height={"100"} width={"100"} color={""} />
                  </div>
                  <div className="text-center mt-5">
                    <h5 className="text-xl">Submission Successful</h5>
                    <p className="text-gray-500">Our Compliance will follow up with you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-5">
            <Button value={"Next"} onClick={() => { router.push('/') }} icon={"arrow-right"} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default SuccessVerification




