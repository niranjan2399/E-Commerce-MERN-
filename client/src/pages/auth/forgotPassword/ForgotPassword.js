import React, { useState } from "react";
import { auth } from "../../../firebase";
import { toast } from "react-toastify";
import AuthWrapper from "../../../components/authWrapper/AuthWrapper";
import "./forgotPassword.scss";
import { handleError } from "../../../utils/handleError";
import { CircularProgress } from "@material-ui/core";

function ForgotPassword() {
  return <AuthWrapper children={<FP />} />;
}

const FP = () => {
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
      setWaiting(false);
    } catch (err) {
      toast.error(err.message);
      setWaiting(false);
    }
  };

  return (
    <div className="fpContainer">
      <div className="fpContainer__title">Forgot Password</div>
      <form onSubmit={handlePasswordReset} className="fpContainer__main">
        <div className="fpContainer__inputContainer">
          <input
            type="text"
            autoFocus
            value={email}
            name="input"
            required
            onInvalidCapture={(e) => handleError(e)}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="input">Email</label>
          <div className="loginContainer__inputBottom"></div>
        </div>
        <button>
          {waiting ? (
            <CircularProgress
              className="icon"
              style={{ color: "white", height: "1.5rem", width: "1.5rem" }}
            />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
