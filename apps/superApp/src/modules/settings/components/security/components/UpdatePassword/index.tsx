/* eslint-disable @nx/enforce-module-boundaries */
import React from 'react'
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Input } from '@instanvi/ui-components';
import Button from 'libs/ui-components/src/lib/button/button';
import { useUpdatePassword } from 'apps/superApp/src/modules/auth/hooks/useUpdatePassword';
import { changePasswordSchema, PasswordFormData } from 'apps/superApp/src/modules/auth/utils/validations';


const UpdatePasword = () => {
  const { mutate, isPending } = useUpdatePassword()
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
        toast.success("Password Changed")
      },
      onError: (error: unknown) => {
        const text = (error as AxiosError<{ message: string }>)?.response?.data
        const message = text?.message
        toast.error(message as string);
      },
    })
  };

  return (
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
  )
}
export default UpdatePasword