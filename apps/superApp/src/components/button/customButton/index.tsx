import React, { FC } from "react";

interface AddButtonProps {
  value: string;
  onclick?: () => void;
  icon: string;
  type?: "submit" | "reset" | "button";
}

const CustomButton: FC<AddButtonProps> = ({ value, onclick, icon, type }) => {
  return (
    <button type={type} className="text-white bg-[#237804] pl-4 pr-6 -pt-0.5 py-2.5 flex space-x-2 justify-center" onClick={onclick}>
      <i className={`ri-${icon}-line  mr-2`}></i>
      {value}
    </button>
  );
};

export default CustomButton;