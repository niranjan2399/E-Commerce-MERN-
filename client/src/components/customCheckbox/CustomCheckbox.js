import React from "react";
import "./customCheckbox.scss";

const CustomCheckbox = ({
  label,
  value,
  onChange,
  name,
  identifier,
  checked = false,
}) => {
  return (
    <div className="boxes">
      <input
        type="checkbox"
        id={label}
        onChange={onChange}
        {...(checked ? { checked: true } : { checked: false })}
        value={value}
        name={name}
        data-identifier={identifier}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
};

export default CustomCheckbox;
