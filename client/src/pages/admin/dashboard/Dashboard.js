import React from "react";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../../components/userSidebar/UserSidebar";
import "./dashboard.scss";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";

function Dashboard() {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <>
      <Navbar />
      <div className="dashboardConatiner">
        {user && (user.role === "admin" ? <AdminSidebar /> : <UserSidebar />)}
        <div className="dashboardContainer__right">
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
          <div>dahsboard</div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
