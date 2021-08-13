import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./registerComplete.scss";
import { auth } from "../../../firebase";
import { toast } from "react-toastify";
import { createUserOrUpdate } from "../../../utils/auth";
import { useDispatch } from "react-redux";
import AuthWrapper from "../../../components/authWrapper/AuthWrapper";
import { handleError } from "../../../utils/handleError";

function RegisterComplete() {
  return <AuthWrapper children={<RegisterCompleteForm />} />;
}

const RegisterCompleteForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    setEmail(window.localStorage.getItem("registeredEmail"));

    return () => {
      setEmail();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      try {
        const res = await auth.signInWithEmailLink(email, window.location.href);

        if (res.user.emailVerified) {
          // delete email from localStorage
          window.localStorage.removeItem("registeredEmail");

          // get user id token
          let user = auth.currentUser;
          await user.updatePassword(password);
          let tokenId = await user.getIdTokenResult();

          // redux store
          const resApi = await createUserOrUpdate(tokenId.token, {
            name: `${firstName.trim()} ${lastName.trim()}`,
          });

          dispatch({
            type: "LOGIN",
            payload: {
              email: resApi.data.email,
              name: resApi.data.name,
              token: tokenId.token,
              role: resApi.data.role,
              _id: resApi.data._id,
            },
          });

          // redirect
          history.push("/");
        }
      } catch (err) {
        toast.error(err.response.data);
      }
    } else {
      toast.error("Passwords don't match");
    }
  };

  return (
    <div className="rcContainer">
      {/* <div className="regContainer__progress"></div> */}
      <span className="rcContainer__head">Complete Registration</span>
      <form className="rcContainer__form" onSubmit={handleSubmit}>
        <div className="rcContainer__inputContainer">
          <input
            type="text"
            value={firstName}
            className="rcContainer__input"
            autoFocus
            id="FirstName"
            onInvalidCapture={(e) => handleError(e)}
            required
            onChange={(e) => setFirstName(e.target.value)}
            name="firstName"
          />
          <label htmlFor="firstName">First Name</label>
          <div className="rcContainer__inputBottom"></div>
        </div>
        <div className="rcContainer__inputContainer">
          <input
            type="text"
            value={lastName}
            className="rcContainer__input"
            onInvalidCapture={(e) => handleError(e)}
            id="lastName"
            required
            onChange={(e) => setLastName(e.target.value)}
            name="lastName"
          />
          <label htmlFor="lastName">Last Name</label>
          <div className="rcContainer__inputBottom"></div>
        </div>
        <div className="rcContainer__inputContainer">
          <div className="rcContainer__inputContainer">
            <input
              type="text"
              value={email}
              required
              className="rcContainer__input rcContainer__input--disabled"
              disabled
            />
            <div className="rcContainer__inputBottom"></div>
          </div>
        </div>
        <div className="rcContainer__inputContainer">
          <input
            type="password"
            name="password"
            className="rcContainer__input"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onInvalidCapture={(e) => handleError(e)}
            autoComplete="password"
          />
          <label htmlFor="password">Password</label>
          <div className="rcContainer__inputBottom"></div>
        </div>
        <div className="rcContainer__inputContainer">
          <input
            type="password"
            name="cfPassword"
            className="rcContainer__input"
            id="cfPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onInvalidCapture={(e) => handleError(e)}
            autoComplete="cfPassword"
          />
          <label htmlFor="cfPassword">Confirm Password</label>
          <div className="rcContainer__inputBottom"></div>
        </div>
        <button className="rcContainer__button" type="submit">
          Submit
        </button>
      </form>
      {password.length < 6 && password.length >= 1 && (
        <div className="rcContainer__error">
          <span>Password must be 6 characters long</span>
        </div>
      )}
    </div>
  );
};

export default RegisterComplete;
