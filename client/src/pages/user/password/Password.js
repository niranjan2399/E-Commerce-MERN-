import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../../firebase";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../../components/userSidebar/UserSidebar";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import "./password.scss";

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
      setLoading(false);
      toast.error("Passwords don't match");
    }
  };

  return (
    <>
      <Navbar />
      <div className="passwordContainer">
        {user && user.role === "admin" ? <AdminSidebar /> : <UserSidebar />}
        <div className="passwordContainer__main">
          <h2>Password Update</h2>
          <div className="passwordContainer__form">
            <form onSubmit={handleSubmit}>
              <label htmlFor="password">Enter new Password</label>
              <input
                type="password"
                name="password"
                id=""
                value={password}
                min="6"
                autoFocus
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="password"
              />
              <label htmlFor="rePassword">Re-Enter new Password</label>
              <input
                type="password"
                name="rePassword"
                value={rePassword}
                required
                onChange={(e) => setRePassword(e.target.value)}
                disabled={loading}
                autoComplete="rePassword"
              />
              <button
                type="submit"
                disabled={password.length < 6}
              >
                Submit
              </button>
              {password.length < 6 && password.length >= 1 && (
                <div className="rcContainer__error">
                  <span>Password must be 6 characters long</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Password;
