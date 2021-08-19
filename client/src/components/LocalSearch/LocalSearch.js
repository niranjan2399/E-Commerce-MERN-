import { Search } from "@material-ui/icons";
import React from "react";
import "./localSearch.scss";

function LocalSearch({
  sendClass,
  keyword,
  functionOnChange,
  placeholder,
  handleSubmit = null,
}) {
  return (
    <div className={sendClass}>
      <input
        type="search"
        placeholder={placeholder}
        value={keyword}
        onChange={functionOnChange}
      />
      <Search
        className="search__icon"
        style={{ cursor: "pointer" }}
        onClick={handleSubmit}
      />
    </div>
  );
}

export default LocalSearch;
