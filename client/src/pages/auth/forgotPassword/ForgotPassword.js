import React, { useState } from "react";
import { auth } from "../../../firebase";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [waiting, setWaiting] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setWaiting(true);

    const config = {
      url: process.env.REACT_APP_PASSWORD_RESET_REDIRECT_URL,
      handleCodeInApp: true,
    };

    try {
      await auth.sendPasswordResetEmail(email, config);
      toast.success("Check your email for password reset link");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
      setWaiting(false);
    }
  };

  return (
    <div className="fpContainer">
      <div className="fpContainer__title">Forgot Password</div>
      <form onSubmit={handlePasswordReset} className="fpContainer__main">
        <input
          type="text"
          autoFocus
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
