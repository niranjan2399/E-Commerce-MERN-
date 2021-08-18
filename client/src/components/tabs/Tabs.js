import React, { useState } from "react";
import "./tabs.scss";

const Tabs = ({ product }) => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="tabsContainer">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          Description
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          More
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          {/* <h2>Description</h2>
          <hr /> */}
          <p>{product.description}</p>
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          {/* <h2>More</h2>
          <hr /> */}
          <p>Call xxxx xxx xxx to know more about this product.</p>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
