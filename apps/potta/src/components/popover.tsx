import React, { useState, Fragment, ReactNode } from "react";
import { Transition, Popover } from "@headlessui/react";

interface CustomPopoverProps {
    children: ReactNode;
}

export default function CustomPopover({ children }: CustomPopoverProps): JSX.Element {

    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    return (
        <Popover className="relative">
            <Popover.Button className={`outline-none`}>
                <div onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="flex border rounded-[2px] cursor-pointer py-1.5 px-2">
                    <i className={`${isPopoverOpen ? "ri-filter-2-line" : "ri-filter-2-line"} text-2xl`}></i>
                </div>
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute -top-14 -left-48 z-20 shadow-lg focus:outline-none">
                    {children}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}