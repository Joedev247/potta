import React, { ReactNode } from 'react';

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: any;
  icon?: ReactNode;
  theme?: keyof typeof themes;
  type: 'submit' | 'button' | 'reset';
  isLoading?: boolean;
  disabled?: boolean;
  width?: 'full';
  height?: boolean;
  color?: boolean;
  rounded?: boolean;
  className?: string;
};

const themes = {
  default: 'bg-[#005D1F]',
  lightBlue: 'bg-[#A0E86F]',
  light: 'bg-green-500',
  red: 'bg-red-500',
  lightGreen: 'bg-[#237804]',
  gray: 'bg-gray-300',
  dark: 'bg-gray-900',
  danger: 'bg-red-500',
};

const Button = ({
  onClick,
  text,
  icon,
  theme,
  color,
  type,
  isLoading,
  width,
  height,
  rounded,
  className
}: Props) => {
  return (
    <button
      type={type}
      className={`whitespace-nowrap ${
        color ? 'text-black' : 'text-white'
      } items-center text-center gap-2 cursor-pointer ${
        width ? 'w-full text-center' : 'flex text-center justify-end'
      } ${theme ? themes[theme] : themes.default} ${
        rounded ? 'rounded-full' : 'rounded-[2px]'
      }  ${height ? 'py-1.5' : 'py-2.5'}  px-6 ${
        isLoading ? 'opacity-65' : 'opacity-none'
      } ${className}`}
      onClick={onClick}
    >
      {icon && icon}
      {isLoading ? 'Loading...' : text}
    </button>
  );
};

export default Button;
