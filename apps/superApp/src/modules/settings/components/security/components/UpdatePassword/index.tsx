/* eslint-disable @nx/enforce-module-boundaries */
import React, { useState } from 'react'
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import VerificationInput from "react-verification-input";
import { SubmitHandler, useForm } from 'react-hook-form';

import { Input, Modal } from '@instanvi/ui-components';
import Button from 'libs/ui-components/src/lib/button/button';
import { useUpdatePassword } from 'apps/superApp/src/modules/auth/hooks/useUpdatePassword';
import { changePasswordSchema, PasswordFormData } from 'apps/superApp/src/modules/auth/utils/validations';
import { useRouter } from 'next/router';
import { useChangePasswordConfirm } from 'apps/superApp/src/modules/auth/hooks/useChangePasswordConfirm';


const UpdatePasword = () => {
  const { push } = useRouter()
  const [code, setCode] = useState("")
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useUpdatePassword()
  const confirmChange = useChangePasswordConfirm()

  const methods = useForm<PasswordFormData>({
    mode: "onChange",
    resolver: yupResolver(changePasswordSchema),
  });

  const { register, reset, handleSubmit } = methods;
  const { errors } = methods.formState;

  const onSubmit: SubmitHandler<PasswordFormData> = (inputs) => {
    const { confirm_password, ...payload } = inputs
    mutate(payload, {
      onSuccess: () => {
        reset();
        toast.success("Check your email to get confirmation code...")
        setOpen(true)
      },
      onError: (error: unknown) => {
        const text = (error as AxiosError<{ message: string }>)?.response?.data
        const message = text?.message
        toast.error(message as string);
      },
    })
  };

  const sendCode = (code: string) => {
    confirmChange.mutate(code, {
      onSuccess: () => {
        setOpen(false)
        toast.success("Password has been Changed")
        localStorage.clear()
        push('/auth/login')
      },
      onError: (error: unknown) => {
        const text = (error as AxiosError<{ message: string }>)?.response?.data
        const message = text?.message
        toast.error(message as string);
      },
    })
  }

  return (
    <>
      <Modal title='OTP code' width='xl' isOpen={open} onClose={() => setOpen(false)}>
        <div className="grid gap-2 xl:px-32 text-center">
          <p> Check your mail and enter your code you recieved here</p>
          <div className='flex justify-center items-center'>
            <VerificationInput value={code} onChange={(value) => setCode(value)} length={6} />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[#34CAA5] font-medium">Send the code Again</p>
            <span className="cursor-default font-semibold hover:text-green-400" onClick={() => setCode("")}>Clear</span>
          </div>
          <Button fullWidth disabled={code?.length !== 6} value={confirmChange.isPending ? "Loading..." : "Validate"} type="button" onClick={() => { sendCode(code) }} />
        </div>
      </Modal>
      <form className='relative' onSubmit={handleSubmit(onSubmit)}>
        <div className='mt-5'>
          <Input
            name="password"
            register={register}
            label="Old Password"
            errors={errors?.password}
            placeholder="Password@123"
          />
        </div>
        <div className='mt-5'>
          <Input
            name="new_password"
            register={register}
            label="New Password"
            placeholder="Password@123"
            errors={errors?.new_password}
          />
        </div>
        <div className='mt-5'>
          <Input
            register={register}
            name="confirm_password"
            placeholder="Password@123"
            label="ReType New Password"
            errors={errors?.confirm_password}
          />
        </div>
        <div className='w-full mt-8 flex justify-end'>
          <Button
            type='submit'
            icon={'arrow-right'}
            value={isPending ? 'Updating...' : 'Update Password'}
          />
        </div>
      </form>
    </>
  )
}
export default UpdatePasword