import React from "react";
import { useSelector } from "react-redux";
import UserSidebar from "../userSidebar/UserSidebar";
import AdminSidebar from "../adminSidebar/AdminSidebar";
import "./navigationOverlay.scss";

const NavigationOverlay = () => {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <div className="hamOverlay">
      <div className="hamContainer">
        {user.role === "admin" ? <AdminSidebar /> : <UserSidebar />}
        <hr />
      </div>
      <div className="hamContainer__options">
        {user ? (
          <div className="hamContainer__loginLogout">
            <button>Logout</button>
          </div>
        ) : (
          <div className="hamContainer__loginLogout">
            <button>Login</button>
            <button>Register</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationOverlay;
