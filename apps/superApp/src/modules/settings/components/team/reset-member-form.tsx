import React, { FC } from 'react'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, Input, Modal } from '@instanvi/ui-components'
import { useResetMemberPassword } from '../../hooks/team/useResetMemberPassword'
import { ResetMemberFormData, resetMemberSchema } from '../../utils/team/validations'
import { IMember } from '../../utils/team/types'

type Props = {
  data: IMember
  isOpen: boolean
  onClose: () => void
}

const ResetMemberForm: FC<Props> = ({ isOpen, onClose, data }) => {
  const { mutate, isPending } = useResetMemberPassword(String(data?.id))

  const methods = useForm<ResetMemberFormData>({
    mode: "onChange",
    defaultValues: { password: "" },
    resolver: yupResolver(resetMemberSchema)
  })

  const { register, handleSubmit, reset } = methods
  const { errors } = methods.formState

  const onSubmit: SubmitHandler<ResetMemberFormData> = (inputs) => {

    mutate(inputs, {
      onSuccess: () => {
        toast.success("Password reset successfully")
        reset()
      },
      onError: (error: unknown) => {
        const text = (error as AxiosError<{ message: string }>)?.response?.data
        const message = text?.message;
        toast.error(message as string);
      }
    })
  }

  return (
    <Modal title="Reset Password" width='sm' isOpen={isOpen} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          name='password'
          type='password'
          label='Passsword'
          register={register}
          errors={errors?.password}
          placeholder={'********'}
        />
        <div className="flex justify-end gap-2">
          <Button value={isPending ? "Reseting..." : "Reset"} type="submit" />
        </div>
      </form>
    </Modal>
  )
}

export default ResetMemberForm