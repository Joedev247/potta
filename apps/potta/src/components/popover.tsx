import React, { useState, Fragment, ReactNode } from "react";
import { Transition, Popover , PopoverButton, PopoverPanel } from "@headlessui/react";

interface CustomPopoverProps {
    children: ReactNode;
    icon?: string;
}

export default function CustomPopover({ children, icon }: CustomPopoverProps): JSX.Element {

    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    return (
        <Popover className="relative z-[10000000]">
            <PopoverButton className={`outline-none`}>
                <div onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="flex border rounded-[2px] cursor-pointer py-1.5 px-2">
                   {icon ? <span className={`inline-block w-4 h-4 mr-2 text-gray-500 ${icon}`} /> :
                    <span>Action</span>}
                  
                </div>
            </PopoverButton>


                <PopoverPanel  >
                    {children}
                </PopoverPanel>

        </Popover>
    );
}
