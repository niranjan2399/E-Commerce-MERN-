import React, { useEffect, useRef, useState } from "react";
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
  const ul = useRef();

  useEffect(() => {
    const temp = options.find((option) => option.value === value);
    setLabel(temp ? temp.title || temp.value : "Please Select");
  }, [options, value]);

  const blur = (e) => {
    setOpen(false);
  };

  const toggle = (e) => {
    setOpen(!open);
  };

  const handleSelect = (e) => {
    setOpen(false);
    handleCustomSelect(e);

    const li = Array.from(ul.current.children);
    li.forEach((element) => {
      if (element === e.currentTarget) {
        element.classList.add("selected");
      } else {
        element.classList.remove("selected");
      }
    });
  };

  return (
    <div className="csContainer" onKeyPress={toggle} tabIndex={0} onBlur={blur}>
      <div
        className={"csContainer__labelWrapper" + (open ? " show" : "")}
        onClick={toggle}
      >
        <p>{label}</p>
        <div className="csContainer__labelRight">
          <ExpandMore className="icon" style={{ color: "white" }} />
        </div>
      </div>
      <ul className="csContainer__options" ref={ul}>
        {options &&
          options.map((option, i) => {
            return (
              <li
                className={
                  "csContainer__option" +
                  (value === option.value ? " selected" : "")
                }
                key={i}
                data-name={option.name}
                data-value={option.value}
                onClick={handleSelect}
              >
                <span>{option.title || option.value}</span>
                <Check className="csContainer__check" />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default CustomSelect;
