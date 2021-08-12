import React from "react";
import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <nav className="sidebar">
      <ul className="sidebar__ul">
        <li className="sidebar__li">
          <NavLink
            to="/admin/dashboard"
            className="sidebar__link"
            activeClassName="sidebar__link--active"
          >
            Dashboard
          </NavLink>
        </li>
        <li className="sidebar__li">
          <NavLink
            to="/admin/products"
            className="sidebar__link"
            activeClassName="sidebar__link--active"
          >
            Products
          </NavLink>
        </li>
        <li className="sidebar__li">
          <NavLink
            to="/admin/categories"
            className="sidebar__link"
            activeClassName="sidebar__link--active"
          >
            Categories
          </NavLink>
        </li>
        <li className="sidebar__li">
          <NavLink
            to="/admin/coupons"
            className="sidebar__link"
            activeClassName="sidebar__link--active"
          >
            Coupons
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

export default AdminSidebar;
