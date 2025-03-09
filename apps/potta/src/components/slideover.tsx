'use client';
import { ReactNode, useState, FC, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './button';

interface props {
  children: ReactNode;
  edit: boolean;
  buttonText?: string;
  title: string;
  onOpen?: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  closeButton?: boolean;
}
const Slider: FC<props> = ({
  children,
  edit,
  buttonText,
  title,
  onOpen,
  open,
  setOpen,
  closeButton,
}) => {
  useEffect(() => {
    if (open && onOpen) {
      onOpen(); // Call the onOpen callback when slider opens
    }
  }, [open, onOpen]);
  return (
    <div className="">
      <div>
        {buttonText == 'Create Product' && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            type={'button'}
            text={'Add Product'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'card' && (
          <Button
            text={'New Card'}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'ussd' && (
          <Button
            text={'New USSD'}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'agent' && (
          <Button
            text={'New Agent'}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'page' && (
          <Button
            text={'New Page'}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'vendor' && (
          <Button
            text={'New Vendor'}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}

      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50 overflow-x-hidden"
      >
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-x-0 top-0 flex max-h-full bg-gray-500 bg-opacity-75 transition-opacity justify-center">
              <DialogPanel
                transition
                className="pointer-events-auto border-b  max-w-screen w-full transform transition duration-500 ease-in-out data-[closed]:-translate-y-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-hidden bg-gray-50 py-6 shadow-xl">
                  <div className="flex justify-center ">
                    <div className="flex items-start py-2 w-full border-b justify-between">
                      <DialogTitle className="text-xl leading-6 px-4 font-bold text-gray-900">
                        {title}
                      </DialogTitle>
                      <div className="ml-3 px-5 flex h-7 items-center">
                        {!closeButton && (
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto flex justify-center">
                    {children}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default Slider;
