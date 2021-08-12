import { Search } from "@material-ui/icons";
import React from "react";
import "./localSearch.scss";

function LocalSearch({ sendClass, keyword, setKeyword, placeholder }) {
  return (
    <div className={sendClass}>
      <input
        type="search"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Search className="search__icon" />
    </div>
  );
}

export default LocalSearch;
