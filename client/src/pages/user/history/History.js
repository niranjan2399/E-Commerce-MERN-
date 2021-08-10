import React from "react";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../../components/userSidebar/UserSidebar";

function History() {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <>
      <Navbar />
      {user && <UserSidebar />}
      <div>history</div>
    </>
  );
}

export default History;
