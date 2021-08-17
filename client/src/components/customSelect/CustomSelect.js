import React, { useEffect, useState } from "react";
import { Check, ExpandMore } from "@material-ui/icons";
import "./customSelect.scss";

function CustomSelect({
  options,
  multiSelect = false,
  handleCustomSelect,
  value,
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState();

  useEffect(() => {
    const temp = options.find((option) => option.value === value);
    setLabel(temp ? temp.value : "Please Select");
  }, [options, value]);

  const blur = (e) => {
    setOpen(false);
  };

  const toggle = (e) => {
    setOpen(!open);
  };

  return (
    <div className="csContainer" onKeyPress={toggle} tabIndex={0} onBlur={blur}>
      <div
        className={"csContainer__labelWrapper" + (open ? " show" : "")}
        onClick={toggle}
      >
        <p>{label}</p>
        <div className="csContainer__labelRight">
          <ExpandMore className="icon" />
        </div>
      </div>
      <ul className="csContainer__options">
        {options &&
          options.map((option, i) => {
            return (
              <li
                className="csContainer__option"
                key={i}
                data-name={option.name}
                data-value={option.value}
                onClick={handleCustomSelect}
              >
                <span>{option.value}</span>
                <Check className="csContainer__check" />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default CustomSelect;
