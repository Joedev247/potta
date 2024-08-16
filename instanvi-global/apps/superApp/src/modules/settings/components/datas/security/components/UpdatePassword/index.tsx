import React from 'react'
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';

import Password from '../../../components/inputs/password';
import CustomButton from '../../../components/button/customButton'
import { useUpdatePassword } from '../../../modules/auth/hooks/useUpdatePassword';
import { changePasswordSchema, PasswordFormData } from '../../../modules/auth/utils/validations';

const UpdatePasword = () => {
    const { mutate, isPending } = useUpdatePassword()
    const methods = useForm<PasswordFormData>({
        mode: "onChange",
        resolver: yupResolver(changePasswordSchema),
    });

    const { register, reset, handleSubmit } = methods;
    const { errors } = methods.formState;

    const onSubmit: SubmitHandler<PasswordFormData> = (inputs) => {
        const { confirmPassword, ...payload } = inputs
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
        <form className='w-[60%] relative' onSubmit={handleSubmit(onSubmit)}>
            <div className='mt-5'>
                <label htmlFor="">Old Password</label>
                <Password id='password' register={register} errors={errors.password} />
            </div>
            <div className='mt-5'>
                <label htmlFor="">New Password</label>
                <Password id='new_password' register={register} errors={errors.new_password} />
            </div>
            <div className='mt-5'>
                <label htmlFor="">ReType New Password</label>
                <Password id='confirmPassword' register={register} errors={errors.confirmPassword} />
            </div>
            <div className='w-full mt-8 flex justify-end'>
                <CustomButton
                    type='submit'
                    icon={'arrow-right'}
                    value={isPending ? 'Updating...' : 'Update Password'}
                />
            </div>
        </form>
    )
}
export default UpdatePasword