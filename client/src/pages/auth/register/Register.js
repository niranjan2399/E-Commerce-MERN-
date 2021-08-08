import React, { useState } from "react";
import "./register.scss";
import { auth } from "../../../firebase";
import { toast } from "react-toastify";

function Register() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };

    try {
      await auth.sendSignInLinkToEmail(email, config);
      toast.success(
        `Email is sent to ${email}.Click on the link to complete your registration`
      );

      // save email to local storage
      window.localStorage.setItem("registeredEmail", email);
      setEmail("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="regContainer">
      {/* <div className="regContainer__progress"></div> */}
      <div className="regContainer__register">
        <h3>Register</h3>
        <form className="regContainer__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="regContainer__input"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="regContainer__button"
            type="submit"
            disabled={!email}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
