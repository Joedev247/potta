'use client'
import React, { FC, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

import { IMember } from '../../utils/team/types';
import { Button, Checkbox, Input, Select } from '@instanvi/ui-components';
import { useCreateMember } from '../../hooks/team/useCreateMember';
import { useUpdateMember } from '../../hooks/team/useUpdateMember';
import { MemberFormData, memberSchema } from '../../utils/team/validations';
import { SingleValue } from 'react-select';

type Prop = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  data?: IMember | undefined
}

type SelectProps = SingleValue<{ value: string; label: string; }>

const MemberForm: FC<Prop> = ({ isOpen, data, onClose }) => {
  const create = useCreateMember()
  const edit = useUpdateMember(String(data?.id))
  const [role, setRole] = useState<SelectProps>({ label: "", value: "" });
  const [msgChecked, setMsgChecked] = useState(false);
  const [ussdChecked, setUssdChecked] = useState(false);
  const [appsChecked, setAppsChecked] = useState(false);
  const [peopleChecked, setPeopleChecked] = useState(false);
  const [airtimeChecked, setAirtimeChecked] = useState(false);
  const [numbersChecked, setNumbersChecked] = useState(false);

  const roles = [
    { value: 'member', label: 'Member' },
  ]

  const defaultValues = {
    email: '',
    lastName: '',
    firstName: '',
    role: 'member',
    password: "password"
  }

  const methods = useForm<MemberFormData>({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(memberSchema),
  })

  const { register, handleSubmit, reset } = methods
  const { errors } = methods.formState

  const onError = (error: unknown) => {
    const text = (error as AxiosError<{ message: string }>)?.response?.data
    const message = text?.message;
    toast.error(message as string);
  }

  const onSubmit: SubmitHandler<MemberFormData> = (inputs) => {
    if (data) {
      edit.mutate(inputs, {
        onSuccess: () => {
          toast.success("Team updated successfully")
        },
        onError
      })
    }
    else {
      create.mutate(inputs, {
        onSuccess: () => {
          toast.success("Team added successfully")
        },
        onError
      })
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>,
    setState: (arg: boolean) => void) => {
    setState(e.target.checked);
  };

  const onRoleChange = (event: SelectProps) => {
    if (event) setRole(event)
  };

  const editable = (input?: IMember) => {
    if (data) {
      return {
        role: input?.role,
        email: input?.email,
        lastName: input?.lastname,
        firstName: input?.firstname,
      }
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  useEffect(() => {
    if (data) {
      const roleResult = roles.find(r => r.value === data?.role) as SelectProps
      setRole(roleResult)
      reset(editable(data))
    }
    else {
      reset(defaultValues)
    }

  }, [data, isOpen])

  return (
    <>
      <Transition show={isOpen}>
        <Dialog className="relative z-50" onClose={handleClose}>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-0  bg-white pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl  ">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="pb-2 px-6 flex justify-between items-center border-b">
                      <h3 className='text-2xl'>{data ? "Edit User" : "Add New User"}</h3>
                      <div className='cursor-pointer -mt-2' onClick={handleClose} >
                        <i className="ri-close-line text-2xl -mt-2"></i>
                      </div>
                    </div>
                    <div className='py-5 px-7'>
                      <div className="grid gap-4">
                        <div className='grid grid-cols-2 gap-3'>
                          <Input
                            name='firstName'
                            label='First Name'
                            register={register}
                            placeholder={'John'}
                            errors={errors?.firstName}
                          />
                          <Input
                            name='lastName'
                            label='Last Name'
                            register={register}
                            placeholder={'Doe'}
                            errors={errors?.lastName}
                          />
                        </div>
                        <Input
                          name='email'
                          type='email'
                          label='Email'
                          register={register}
                          errors={errors?.email}
                          placeholder={'hello@example.com'}
                        />
                        <div>
                          <label htmlFor="" className="capitalize font-semibold text-[0.75rem] mb-1">Role</label>
                          <Select value={role} options={roles} onChange={onRoleChange} />
                        </div>
                        <div className='mt-3 mb-10 mx-auto '>
                          <label htmlFor="" className="capitalize font-semibold text-[1rem]">Permissions</label>
                          <div className="mt-3 grid grid-cols-3 md:grid-cols-6 space-x-2">
                            <Checkbox
                              name="messaging"
                              text="Messaging"
                              value={msgChecked}
                              onChange={(e) => onChange(e, setMsgChecked)}
                            />
                            <Checkbox
                              name="numbers"
                              text="Numbers"
                              value={numbersChecked}
                              onChange={(e) => onChange(e, setNumbersChecked)}
                            />
                            <Checkbox
                              name="ussd"
                              text="USSD"
                              value={ussdChecked}
                              onChange={(e) => onChange(e, setUssdChecked)}
                            />
                            <Checkbox
                              name="airtime"
                              text="Airtime"
                              value={airtimeChecked}
                              onChange={(e) => onChange(e, setAirtimeChecked)}
                            />
                            <Checkbox
                              name="apps"
                              text="Apps"
                              value={appsChecked}
                              onChange={(e) => onChange(e, setAppsChecked)}
                            />
                            <Checkbox
                              name="people"
                              text="People"
                              value={peopleChecked}
                              onChange={(e) => onChange(e, setPeopleChecked)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='mt-16 pr-4 pt-4 border-t w-full flex justify-end'>
                        <Button value={'Add User'} type="submit" icon={'arrow-right'} />
                      </div>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
export default MemberForm;