import React from "react";
import { Link } from "react-router-dom";
import "./categoryList.scss";

const CategoryList = ({ list, to }) => {
  return (
    <div className="listContainer">
      {list &&
        list.map((l) => {
          return (
            <Link
              to={to + "/" + l.slug}
              className="listContainer__link"
              key={l.slug}
            >
              {l.name}
            </Link>
          );
        })}
    </div>
  );
};

export default CategoryList;
