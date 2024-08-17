import React, { FC } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
} from "@nextui-org/react";

const MoreIcon: FC = () => {
    return (
        <Popover placement="left-start" showArrow={true}>
            <PopoverTrigger>
                <Button className="flex w-6 h-6 rounded-full items-center justify-evenly hover:bg-gray-100">
                    <i className="ri-more-2-line text-lg cursor-pointer"></i>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="p-1 bg-white shadow-md flex flex-col gap-2">
                    <div className="text-xs cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]"><h1>Cancel Plan</h1></div>
                    <div className="text-xs cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]"><h1>Activate ID</h1></div>
                    <div className="text-xs cursor-pointer hover:bg-red-200 py-0.5 px-2 rounded-[2px] text-red-600"><h1>Delete ID</h1></div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default MoreIcon;
