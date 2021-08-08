import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./registerComplete.scss";
import { auth } from "../../../firebase";
import { toast } from "react-toastify";

function RegisterComplete() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();

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
          // redirect
          history.push("/");
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      console.log("Passwords don't match");
    }
  };

  return (
    <div className="rcContainer">
      {/* <div className="regContainer__progress"></div> */}
      <div className="rcContainer__register">
        <h3>Complete Registration</h3>
        <form className="rcContainer__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="rcContainer__input"
            value={email}
            disabled
          />
          <input
            type="password"
            name=""
            id="password"
            placeholder="Password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="password"
          />
          <input
            type="password"
            name=""
            id="cfPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="cfPassword"
          />
          <button
            className="rcContainer__button"
            type="submit"
            disabled={password.length < 6}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterComplete;
