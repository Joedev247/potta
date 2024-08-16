import { useState } from 'react'
import { Description, Field, Label, Switch } from '@headlessui/react'


import React, { FC } from "react";

interface ProceedCheckbox {
    label: string;
    description: string;
    name: string;
    value: string;
}

const SWITCH: FC<ProceedCheckbox> = ({ label, name, description, value }) => {
    const [enabled, setEnabled] = useState(false)
    return (
        <Field className="flex w-full justify-between">
            <span className="flex flex-grow flex-col">
                <Label as="span" passive className="text-[18px]   leading-6 text-gray-900">
                    {label}
                </Label>
                <Description as="span" className="text-[15px] text-gray-500">
                    {description}
                </Description>
            </span>
            <Switch
                checked={enabled}
                onChange={setEnabled}
                className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out  data-[checked]:bg-green-500"
            >
                <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                />
            </Switch>
        </Field>
    );
};

export default SWITCH;


