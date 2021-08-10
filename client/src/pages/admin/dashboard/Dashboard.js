import React from "react";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../../components/userSidebar/UserSidebar";

function Dashboard() {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <>
      <Navbar />
      {user && <UserSidebar />}
      <div>dahsboard</div>
    </>
  );
}

export default Dashboard;
