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
        backgroundColor: "#F3FBFB",
        border: "1px solid #E5E7EB",
        transition: "border 0.3s ease",
        "&:hover": {
          border: "1px solid #237804"
        },
        "&:focus": {
          border: "1px solid #237804"
        },
      })
    }} options={options}
      onChange={onChange} />
  );
}

export default Select;
