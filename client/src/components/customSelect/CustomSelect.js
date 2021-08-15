import React, { useEffect } from "react";
import Select from "./Select";
import "./customSelect.scss";

function CustomSelect() {
  useEffect(() => {
    (() => {
      const select = document.querySelectorAll(".customSelect");

      select.forEach((element) => {
        new Select(element);
      });
    })();
  });

  return (
    <select className="customSelect">
      <option value="">Please Select</option>
      <option value="niranjan">Niranjan</option>
      <option value="basant">Basant</option>
      <option value="siddha">Siddha</option>
      <option value="pooja">Pooja</option>
    </select>
  );
}

export default CustomSelect;
