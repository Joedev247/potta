import Select from 'react-select'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import PhoneInput from 'react-phone-input-2'
import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'

import { countryList } from 'apps/superApp/src/utils'
import { Button, Input } from '@instanvi/ui-components'
import { SelectProp } from 'apps/superApp/src/utils/types'
import { useUpdateProfile } from 'apps/superApp/src/modules/auth/hooks/useUpdateProfile'
import { ProfileData, profileSchema } from 'apps/superApp/src/modules/auth/utils/validations'

const languages = [
    { value: "english", label: "English" },
    { value: "french", label: "French" }
]

const General = () => {
    const [phone, setPhone] = useState('')
    const { mutate, isPending } = useUpdateProfile()

    const methods = useForm<ProfileData>({
        mode: "onChange",
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
            postcode: String(inputs?.postcode)
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

    useEffect(() => {
        reset(({
            country: "",
            firstName: ""
        }))
    }, [])

    return (
        <form className='mt-5  md:px-16 relative' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-4'>
                <div className='mt-8'>
                    <Input
                        type="text"
                        name="firstName"
                        label='First Name'
                        register={register}
                        placeholder={'Jean'}
                        errors={errors?.firstName}
                    />
                </div>
                <div className='mt-8'>
                    <Input
                        type="text"
                        name="lastName"
                        label='Last Name'
                        register={register}
                        placeholder={'Paul'}
                        errors={errors?.lastName}
                    />
                </div>
            </div>
            <div className='mt-8 w-full'>
                <div className='flex space-x-1'>
                    <label htmlFor="">Company Name</label>
                    <i className='ri-checkbox-circle-fill text-green-400'></i>
                </div>
                <Input
                    type="text"
                    name="name"
                    register={register}
                    errors={errors?.name}
                    placeholder={'ABC Company'} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div className='mt-8'>
                    <div className='flex mb-3 space-x-1'>
                        <label htmlFor="">Phone Number</label>
                        <i className='ri-checkbox-circle-fill text-green-400'></i>
                    </div>
                    <PhoneInput
                        country={'cm'}
                        value={phone}
                        inputClass=" "
                        containerClass=" "
                        countryCodeEditable
                        onChange={val => setPhone(val)}
                    />
                </div>
                <div className='mt-8'>
                    <div className='flex space-x-1'>
                        <label htmlFor="">Email</label>
                        <i className='ri-checkbox-circle-fill text-green-400'></i>
                    </div>
                    <Input
                        type="email"
                        name="email"
                        register={register}
                        errors={errors.email}
                        placeholder={'Pauljean@gmail.com'}
                    />
                </div>
            </div>
            <div className='grid grid-cols-2 mt-3  gap-2'>
                <div className='mt-8'>
                    <p className='mb-2'>Country</p>
                    <Select
                        options={countryList}
                        onChange={(val) => onSelectChange("country", val)}
                    />
                </div>
                <div className='mt-8'>
                    <p className='mb-2'>Language</p>
                    <Select
                        options={languages}
                        onChange={(val) => onSelectChange("language", val)}
                    />
                </div>
            </div>
            <div className='mt-10 w-full flex justify-end'>
                <Button
                    type='submit'
                    value='Update'
                    icon='arrow-right'
                />
            </div>
        </form>
    )
}
export default General