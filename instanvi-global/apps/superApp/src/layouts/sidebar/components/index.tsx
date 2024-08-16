import React, { FC } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import ContentSidebar from "./content";


const ButtonIcon: FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (

        <Popover isOpen={isOpen} placement="top-start">
            <PopoverTrigger>
                <img src="/icons/plus.svg" className="cursor-pointer" onClick={() => { setIsOpen(!isOpen) }} height={30} width={30} alt="" />
            </PopoverTrigger>
            <PopoverContent className="border  ml-7 w-full bg-white">
                <ContentSidebar />
            </PopoverContent>
        </Popover>
    );
};

export default ButtonIcon;
