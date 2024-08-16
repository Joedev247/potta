import React, { FC } from "react";

interface ProceedButton {
    type?: "button" | "submit" | "reset"
    value: string;
    onclick?: () => void;
    disabled?: boolean
}

const Proceed: FC<ProceedButton> = ({ value, onclick, type, disabled }) => {
    return (
        <button disabled={disabled} type={type} className="text-white bg-[#237804] w-full   py-2.5 flex space-x-2 justify-center" onClick={onclick}>
            {value}
        </button>
    );
};

export default Proceed;