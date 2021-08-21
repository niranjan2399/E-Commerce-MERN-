import React, { useRef } from "react";
import { ExpandMore } from "@material-ui/icons";
import "./accordion.scss";

const Accordion = ({ title, children }) => {
  const bottom = useRef();

  const handleShowBottom = () => {
    if (bottom.current.hasAttribute("style")) {
      bottom.current.removeAttribute("style");
    } else {
      bottom.current.style.maxHeight = bottom.current.scrollHeight + "px";
    }
  };

  return (
    <div className="accordion">
      <div className="accordion__top" onClick={handleShowBottom}>
        {title} <ExpandMore />
      </div>
      <div ref={bottom} className="accordion__bottom">
        {children}
      </div>
    </div>
  );
};

export default Accordion;
