import React from "react";
import "./warning.scss";
import { Warning } from "@material-ui/icons";

function WarningDiv({ message }) {
  return (
    <div className="warning">
      <Warning style={{ color: "yellow", marginRight: "1rem" }} />
      {message}
    </div>
  );
}

export default WarningDiv;
