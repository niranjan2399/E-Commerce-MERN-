import React from "react";
import { NavLink } from "react-router-dom";
import "./userSidebar.scss";

function UserSidebar() {
  return (
    <nav className="sidebar">
      <ul className="sidebar__ul">
        <li className="sidebar__li">
          <NavLink
            to="/user/history"
            className="sidebar__link"
            activeClassName="sidebar__link--active"
          >
            History
          </NavLink>
        </li>
        <li className="sidebar__li">
          <NavLink
            to="/user/wishlist"
            className="sidebar__link"
            activeClassName="sidebar__link--active"
          >
            WishList
          </NavLink>
        </li>
        <li className="sidebar__li">
          <NavLink
            to="/user/password"
            className="sidebar__link"
            activeClassName="sidebar__link--active"
          >
            Password
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default UserSidebar;
