'use client'

import React, { FC, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import CustomButton from '../../button/customButton';
import { Button, Checkbox, Input } from '@instanvi/ui-components';

const TeamUserModal: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [msgChecked, setMsgChecked] = useState(false);
  const [ussdChecked, setUssdChecked] = useState(false);
  const [appsChecked, setAppsChecked] = useState(false);
  const [peopleChecked, setPeopleChecked] = useState(false);
  const [airtimeChecked, setAirtimeChecked] = useState(false);
  const [numbersChecked, setNumbersChecked] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>,
    setState: (arg: boolean) => void) => {
    setState(e.target.checked);
  };


  return (
    <>
      <CustomButton value={'New ID'} onclick={() => setOpen(!open)} icon={'add'} />

      <Transition show={open}>
        <Dialog className="relative z-50" onClose={() => setOpen(open)}>
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
                  <div>
                    <div className="pb-2 px-6 flex justify-between items-center border-b">
                      <h3 className='text-2xl'>Add New User</h3>
                      <div className='cursor-pointer -mt-2' onClick={() => setOpen(false)} >
                        <i className="ri-close-line text-2xl -mt-2"></i>
                      </div>
                    </div>
                    <div className='py-5 px-7'>
                      <div className="grid gap-4">
                        <div className='grid grid-cols-2 gap-3'>
                          <Input name='first_name' label='First Name' placeholder={'John'} />
                          <Input name='last_name' label='Last Name' placeholder={'Doe'} />
                        </div>
                        <div className="">
                          <Input name='email' label='Email' type='email' placeholder={'hello@example.com'} />
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
                        <Button value={'Add User'} onClick={() => { console.log("clicked") }} icon={'arrow-right'} />
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
export default TeamUserModal;