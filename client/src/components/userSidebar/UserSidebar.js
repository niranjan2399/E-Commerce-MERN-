import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import firebase from "firebase/app";
import "./userSidebar.scss";
import { useDispatch } from "react-redux";

function UserSidebar() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    firebase.auth().signOut();

    dispatch({
      type: "LOGOUT",
      payload: null,
    });

    history.push("/login");
  };

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
      <div className="hamOptions">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default UserSidebar;
