import React from "react";
import { formHide } from "../../utils/animate";
import "./overlay.scss";

function Overlay({ overlayRef, formRef }) {
  return (
    <div
      ref={overlayRef}
      className="overlay"
      onClick={() => formHide(overlayRef, formRef)}
    ></div>
  );
}

export default Overlay;
