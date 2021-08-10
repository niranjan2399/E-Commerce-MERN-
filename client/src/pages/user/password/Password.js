import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../../firebase";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../../components/userSidebar/UserSidebar";

function Password() {
  const { user } = useSelector((state) => ({ ...state }));
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password === rePassword) {
      try {
        await auth.currentUser.updatePassword(password);
        toast.success("Password updated");
        setLoading(false);
        setPassword("");
        setRePassword("");
      } catch (err) {
        setLoading(false);
        toast.error("Password update failed");
      }
    } else {
      toast.error("Passwords don't match");
    }
  };

  return (
    <>
      <Navbar />
      {user && <UserSidebar />}
      <div>
        <h3>Password Update</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">Enter new Password</label>
          <input
            type="password"
            name="password"
            id=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="password"
          />
          <label htmlFor="rePassword">Re-Enter new Password</label>
          <input
            type="password"
            name="rePassword"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            disabled={loading}
            autoComplete="rePassword"
          />
          <button type="submit" disabled={!password || !rePassword}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Password;
