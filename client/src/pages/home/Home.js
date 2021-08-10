import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../components/userSidebar/UserSidebar";

function Home() {
  const { user } = useSelector((state) => ({ ...state }));
  
  return (
    <>
      <Navbar />
      {user && <UserSidebar />}
      <div>home</div>
    </>
  );
}

export default Home;
