import { ExpandMore } from "@material-ui/icons";
import React from "react";

const Accordion = ({ title, children }) => {
  return (
    <div>
      <div>
        {title} <ExpandMore />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Accordion;
