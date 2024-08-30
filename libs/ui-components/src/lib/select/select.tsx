import React from "react";
import ReactSelect, { SingleValue } from "react-select";

type SelectProp = { label: string, value: string }

type Props = {
  styles?: object
  options: SelectProp[]
  onChange?: (arg: SingleValue<SelectProp>) => void
}

const Select: React.FC<Props> = ({ options, styles, onChange }) => {

  return (
    <ReactSelect styles={{
      control: () => ({
        ...styles,
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0.2rem .5rem",
        border: "1px solid #E5E7EB",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          border: "1px solid #237804"
        },
        "&:focus": {
          backgroundColor: "#E5E7EB"
        },
      })
    }} options={options}
      onChange={onChange} />
  );
}

export default Select;
