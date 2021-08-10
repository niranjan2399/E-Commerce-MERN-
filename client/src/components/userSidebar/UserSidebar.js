import React from "react";
import { NavLink } from "react-router-dom";

function UserSidebar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/user/history">History</NavLink>
        </li>
        <li>
          <NavLink to="/user/password">Password</NavLink>
        </li>
        <li>
          <NavLink to="/user/wishlist">WishList</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default UserSidebar;
