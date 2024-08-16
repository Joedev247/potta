'use client'

import React, { FC, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import TextInput from '../../inputs/text';
import CustomButton from '../../button/customButton';
import Checkbox from '../../checkbox';
import CompletePayment from './components/completePayment';
import PaymentDetail from './components/paymentDetail';
import BankPayment from './components/bankPayment';

const WalletModal: FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [next, setNext] = useState<boolean>(false)
    return (
        <>

            <button className='text-white bg-[#c88a02] rounded-full h-5 pt-0.5 mt-2 text-xs px-5 ' onClick={() => setOpen(!open)}>Top up</button>
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
                                <DialogPanel className="relative transform overflow-hidden  rounded-0  bg-white   pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl  ">
                                    <div>
                                        <div className="pb-2 px-6 flex justify-between  sm:mt-2 border-b">
                                            <div><h3 className='text-3xl'>{next ? 'Complete Payment' : 'Make Payment'}</h3></div>
                                            <div className='cursor-pointer -mt-2' onClick={() => setOpen(false)} >
                                                <i className="ri-close-line text-2xl -mt-2"></i>
                                            </div>
                                        </div>
                                        <div className='p-5'>
                                            {next ? <CompletePayment /> : <BankPayment />}
                                        </div>
                                        <div className='mt-10 p-5 pt-4 border-t w-full flex justify-end'>
                                            <CustomButton value={'Proceed'} onclick={() => { setNext(!next) }} icon={'arrow-right'} />
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
export default WalletModal;