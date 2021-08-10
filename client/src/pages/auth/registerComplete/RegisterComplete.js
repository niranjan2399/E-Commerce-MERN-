import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./registerComplete.scss";
import { auth } from "../../../firebase";
import { toast } from "react-toastify";
import { createUserOrUpdate } from "../../../utils/auth";
import { useDispatch } from "react-redux";

function RegisterComplete() {
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
            name: `${firstName} ${lastName}`,
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
        toast.error(err);
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
            value={firstName}
            autoFocus
            placeholder="First Name"
            id="FirstName"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            value={lastName}
            placeholder="Last Name"
            id="lastName"
            onChange={(e) => setLastName(e.target.value)}
          />
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
