import React, { ReactNode } from "react";

type Props = {
    onClick?: () => void;
    text?: string;
    icon?: ReactNode;
    theme?: string;
    type: "submit" | "button" | "reset";
    isLoading?: boolean;
    disabled?: boolean;
};

const themes: { [key: string]: string } = {
    default: "bg-blue-500",
    light: "bg-blue-500",
    red: "bg-red-500",
};

const Button = ({ onClick, text, icon, theme, type, isLoading }: Props) => {
    return (
        <button
            type={type}
            className={`flex justify-center gap-2 cursor-pointer text-white ${theme ? themes[theme] : themes.default
                } rounded-[2px] py-2.5 px-6 $ {isLoading ? "opacity-65" : "opacity-none"}`}
            onClick={onClick && onClick}
        >
            {icon && icon}
            {isLoading ? "Loading..." : text}
        </button>
    );
};

export default Button;
