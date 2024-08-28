import { FC } from "react";

interface Props {
  value: string;
  onClick?: () => void;
  icon?: string;
  fullWidth?: boolean;
  type?: "submit" | "reset" | "button";
  disabled?: boolean
}

const Button: FC<Props> = ({ value, onClick, icon, type, disabled, fullWidth }) => {
  return (
    <button type={type} disabled={disabled} className={`btn text-white bg-[#237804] hover:bg-[#3a9918] ${fullWidth ? "w-full" : ""} pl-4 pr-6 -pt-0.5 py-2.5 flex space-x-2 justify-center`} onClick={onClick}>
      <i className={`ri-${icon}-line icon mr-2`} />
      {value}
    </button>
  );
};

export default Button;
