import React, { useState } from "react";
import "./navbar.scss";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase/app";
import { IconButton, Badge } from "@material-ui/core";
import { ShoppingCart, Person, PersonAdd, Dashboard } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import LocalSearch from "../LocalSearch/LocalSearch";

function Navbar() {
  const [select, setSelect] = useState("login");
  const history = useHistory();
  const dispatch = useDispatch();
  // const state = useSelector((state) => state);
  const { user, search, cart } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const handleLogout = () => {
    firebase.auth().signOut();

    dispatch({
      type: "LOGOUT",
      payload: null,
    });

    history.push("/login");
  };

  const handleSearch = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push("/shop");
  };

  return (
    <nav className="navContainer">
      <div className="navContainer__left">
        <NavLink
          to="/"
          exact
          activeStyle={{ color: "#777" }}
          className="navContainer__logo"
        >
          E.C
        </NavLink>
        <NavLink
          to="/shop"
          exact
          activeClassName="active"
          className="navContainer__link"
        >
          <span>Shop</span>
        </NavLink>
        <form onSubmit={handleSubmit}>
          <LocalSearch
            sendClass="navContainer__search"
            keyword={text}
            functionOnChange={handleSearch}
            placeholder="Search"
            handleSubmit={handleSubmit}
          />
        </form>
      </div>
      <div className="navContainer__right">
        {!user ? (
          <div className="navContainer__options">
            <span>{select}</span>
            <div className="navContainer__selector">
              <NavLink
                to="/login"
                exact
                activeClassName="select_active"
                className="navContainer__opt"
                onClick={() => setSelect("login")}
              >
                <Person className="navContainer__icon" />
                Login
              </NavLink>
              <NavLink
                to="/register"
                exact
                activeClassName="select_active"
                className="navContainer__opt"
                onClick={() => setSelect("register")}
              >
                <PersonAdd className="navContainer__icon" />
                Register
              </NavLink>
            </div>
          </div>
        ) : (
          <div className="navContainer__options">
            <span>Hello, {user.name.split(" ")[0]}</span>
            <div className="navContainer__selector">
              <NavLink
                to={
                  user.role === "admin" ? "/admin/dashboard" : "/user/history"
                }
                className="navContainer__opt"
                activeClassName="select_active"
              >
                <Dashboard className="navContainer__icon" />
                Dashboard
              </NavLink>
              <div className="navContainer__opt" onClick={handleLogout}>
                <FontAwesomeIcon
                  className="navContainer__icon"
                  icon={faSignOutAlt}
                />
                Logout
              </div>
            </div>
          </div>
        )}
        <NavLink
          to="/cart"
          exact
          activeClassName="active"
          className="navContainer__cart"
        >
          <IconButton
            style={{
              width: "2.5rem",
              height: "2.5rem",
              transition: "all 200ms linear",
            }}
          >
            <Badge badgeContent={cart.length} color="secondary" max={5}>
              <ShoppingCart />
            </Badge>
          </IconButton>
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
