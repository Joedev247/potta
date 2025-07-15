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
  open?: boolean; // Made optional
  setOpen?: (value: boolean) => void; // Made optional
  closeButton?: boolean;
  noPanelScroll?: boolean;
  sliderClass?: string;
  sliderContentClass?: string;
}

const Slider: FC<props> = ({
  children,
  edit,
  buttonText,
  title,
  onOpen,
  open: externalOpen,
  setOpen: externalSetOpen,
  closeButton,
  sliderClass,
  noPanelScroll,
  sliderContentClass,
}) => {
  // Internal state for when open/setOpen aren't provided
  const [internalOpen, setInternalOpen] = useState(false);

  // Determine if we're in controlled or uncontrolled mode
  const isControlled =
    externalOpen !== undefined && externalSetOpen !== undefined;

  // Use either the external or internal state
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalSetOpen : setInternalOpen;

  useEffect(() => {
    if (open && onOpen) {
      onOpen(); // Call the onOpen callback when slider opens
    }
  }, [open, onOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div className="">
      <div>
        {buttonText == 'card' && (
          <Button
            text={'New Card'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'ussd' && (
          <Button
            text={'New USSD'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'agent' && (
          <Button
            text={'New Agent'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'page' && (
          <Button
            text={'New Page'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'benefits' && (
          <Button
            text={'New Benefits'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'New Sales Receipt' && (
          <Button
            text={'New Sales Receipt'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'New Schedules' && (
          <Button
            text={'New Policy'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'vendor' && (
          <Button
            text={'Create New Vendor'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'journal' && (
          <Button
            text={'New Journal Entry'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'assets' && (
          <Button
            text={'Create Asset'}
            onClick={handleToggle}
            type={'button'}
            icon={<i className="ri-file-add-line"></i>}
          />
        )}
        {buttonText == 'deductions' && (
          <Button
            text={'New Deduction'}
            onClick={handleToggle}
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
                className="pointer-events-auto border-b max-w-screen h-screen w-full transform transition duration-500 ease-in-out data-[closed]:-translate-y-full sm:duration-500"
                style={noPanelScroll ? { overflowY: 'visible' } : {}}
              >
                <div
                  className={`flex h-full flex-col bg-gray-50 py-6 shadow-xl${
                    noPanelScroll ? '' : ' overflow-y-auto'
                  } ${sliderClass}`}
                >
                  <div className="flex justify-center items-center ">
                    <div className="flex py-2 px-4 w-full border-b justify-between">
                      <DialogTitle className="text-xl leading-6 font-bold text-gray-900">
                        {title}
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        {!closeButton && (
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="relative rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto flex custom-scrollbar justify-center ${sliderContentClass}`}
                  >
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
