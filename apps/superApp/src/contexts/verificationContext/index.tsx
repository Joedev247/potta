import React, { createContext, ReactNode, useState } from "react";
import { AddressProp, BusinessProp, IndentityProp } from "../../modules/auth/utils/types";


interface ContextType {
  toggle: string;
  activeStep: number;
  addressData: AddressProp;
  businessData: BusinessProp;
  identityData: IndentityProp;
  setToggle: (toggle: string) => void;
  setActiveStep: (arg: number) => void;
  setAddressData: (toggle: AddressProp) => void;
  setBusinessData: (toggle: BusinessProp) => void;
  setidentityData: (toggle: IndentityProp) => void;
}

const defaultState = {
  toggle: "",
  activeStep: 0,
};

const ContextData = createContext<Partial<ContextType>>(defaultState);

interface Children {
  children: ReactNode;
}

const DataProvider: React.FC<Children> = ({ children }) => {
  const [toggle, setToggle] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [addressData, setAddressData] = useState<AddressProp>(null);
  const [businessData, setBusinessData] = useState<BusinessProp>(null);
  const [identityData, setidentityData] = useState<IndentityProp>(null);

  const value = {
    toggle,
    setToggle,
    activeStep,
    addressData,
    identityData,
    businessData,
    setActiveStep,
    setAddressData,
    setBusinessData,
    setidentityData,
  };

  return <ContextData.Provider value={value}>{children}</ContextData.Provider>;
};

export { ContextData, DataProvider };
