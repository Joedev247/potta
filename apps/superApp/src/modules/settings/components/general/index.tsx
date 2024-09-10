/* eslint-disable @nx/enforce-module-boundaries */
import { Select } from "@instanvi/ui-components"
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import timezones from 'timezones-list';
import PhoneInput from 'react-phone-input-2'
import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'

import useAuth from "../../../auth/hooks/useAuth";
import { countryList } from "@instanvi/utilities";
import { Button, Input } from '@instanvi/ui-components'
import { IUser, SelectProp } from 'apps/superApp/src/utils/types'
import { useUpdateProfile } from 'apps/superApp/src/modules/auth/hooks/useUpdateProfile'
import { ProfileData, profileSchema } from 'apps/superApp/src/modules/auth/utils/validations'

const languages = [
  { value: "english", label: "English" },
  { value: "french", label: "French" }
]

const timezoneOptions = timezones?.map(timezone => {
  return {
    label: timezone.label,
    value: timezone.utc
  }
})

const General = () => {
  const { user } = useAuth()
  const [phone, setPhone] = useState('')
  const [timeZone, setTimeZone] = useState('')
  const { mutate, isPending } = useUpdateProfile()

  const methods = useForm<ProfileData>({
    mode: "onChange",
    defaultValues: {
      phone: "",
      country: "",
      timezone: "",
      lastName: "",
      language: "",
      firstName: "",
    },
    resolver: yupResolver(profileSchema),
  });

  const { register, reset, setValue, handleSubmit } = methods;
  const { errors } = methods.formState;

  const onSelectChange = (field: keyof ProfileData, val: SelectProp) => {
    const value = val;
    setValue(field, value?.value as string);
  };

  const onSubmit: SubmitHandler<ProfileData> = (inputs) => {
    const payload = {
      ...inputs,
    }

    mutate(payload, {
      onSuccess: () => {
        reset();
        toast.success("Profile Updated")
      },
      onError: (error: unknown) => {
        const text = (error as AxiosError<{ message: string }>)?.response?.data
        const message = text?.message
        toast.error(message as string);
      },
    })
  };

  const editable = (data: IUser) => {
    return {
      name: data?.name,
      city: "",
      email: data?.email,
      about: "",
      address: "",
      country: data?.country,
      lastName: data?.lastName,
      firstName: data?.firstName,
      language: "",
    }
  }

  useEffect(() => {
    if (user) reset(editable(user))
  }, [user])

  return (
    <form className='mt-10 grid gap-4 md:mx-auto md:px-16 relative xl:w-[60%]' onSubmit={handleSubmit(onSubmit)}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Input
            type="text"
            name="firstName"
            label='First Name'
            register={register}
            placeholder={'Jean'}
            errors={errors?.firstName}
          />
        </div>
        <div>
          <Input
            type="text"
            name="lastName"
            label="Last Name"
            register={register}
            placeholder={'Paul'}
            errors={errors?.lastName}
          />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label htmlFor="" className="capitalize font-semibold text-[0.75rem]">Phone Number</label>
          <PhoneInput
            country={'cm'}
            value={phone}
            inputClass=""
            containerClass="phone-input border-red-500"
            countryCodeEditable
            onChange={val => setPhone(val)}
          />
        </div>
        <div>
          <label className="capitalize font-semibold text-[0.75rem]">Country</label>
          <Select
            options={countryList}
            onChange={(val) => onSelectChange("country", val)}
          />
          {errors?.country ? (
            <small className="col-span-2 text-red-500">{errors?.country?.message}</small>
          ) : null}
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div>
          <label className="capitalize font-semibold text-[0.75rem]">Time Zone</label>
          <Select
            options={timezoneOptions}
            onChange={(val) => onSelectChange("timezone", val)}
          />
          {errors?.language ? (
            <small className="col-span-2 text-red-500">{errors?.language?.message}</small>
          ) : null}
        </div>
        <div>
          <label className="capitalize font-semibold text-[0.75rem]">Language</label>
          <Select
            options={languages}
            onChange={(val) => onSelectChange("language", val)}
          />
          {errors?.language ? (
            <small className="col-span-2 text-red-500">{errors?.language?.message}</small>
          ) : null}
        </div>
      </div>
      <div className='mt-10 w-full flex justify-end'>
        <Button
          type='submit'
          value={isPending ? 'Updating...' : 'Update'}
          icon='arrow-right'
        />
      </div>
    </form>
  )
}
export default General