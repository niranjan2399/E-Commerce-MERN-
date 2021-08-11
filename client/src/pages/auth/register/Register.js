import React, { useState } from "react";
import "./register.scss";
import { auth } from "../../../firebase";
import { toast } from "react-toastify";
import AuthWrapper from "../../../components/authWrapper/AuthWrapper";
import { handleError } from "../../../utils/handleError";

function Register() {
  return <AuthWrapper children={<RegisterForm />} />;
}

const RegisterForm = () => {
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
      toast.error(err.message);
    }
  };

  return (
    <div className="regContainer">
      {/* <div className="regContainer__progress"></div> */}
      <span className="regContainer__head">Register</span>
      <form className="regContainer__form" onSubmit={handleSubmit}>
        <div className="regContainer__inputContainer">
          <input
            type="text"
            name="input"
            className="regContainer__input"
            autoFocus
            required
            value={email}
            onInvalidCapture={(e) => handleError(e)}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="input">Email</label>
          <div className="regContainer__inputBottom"></div>
        </div>
        <button className="regContainer__button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
