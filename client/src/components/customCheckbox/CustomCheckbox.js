import React from "react";
import "./customCheckbox.scss";

const CustomCheckbox = ({ label, value, onChange, name, identifier }) => {
  return (
    <div className="boxes">
      <input
        type="checkbox"
        id={label}
        onChange={onChange}
        value={value}
        name={name}
        data-identifier={identifier}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
};

export default CustomCheckbox;
