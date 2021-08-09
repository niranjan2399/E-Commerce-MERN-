import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import firebase from "firebase";
import { auth, googleAuthProvider } from "../../../firebase";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import axios from "../../../axios";
import { createUser } from "../../../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const roleBasedRedirect = (role) => {
    if (role === "admin") {
      history.push("/admin/dashboard");
    } else {
      history.push("/user/history");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      const { user } = res;
      const tokenId = await user.getIdTokenResult();

      const resUser = await axios.post(`/user/${email}`);
      const [{ name, role, _id }] = resUser.data;

      dispatch({
        type: "LOGIN",
        payload: {
          email,
          name,
          token: tokenId.token,
          role,
          _id,
        },
      });
      roleBasedRedirect(role);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await auth.signInWithPopup(googleAuthProvider);

      const { user } = res;
      const tokenId = await user.getIdTokenResult();

      const resUser = await createUser(tokenId.token, {});
      console.log(resUser.data);

      dispatch({
        type: "LOGIN",
        payload: {
          email: resUser.data.email,
          token: tokenId.token,
          name: resUser.data.name,
          role: resUser.data.role,
          _id: resUser.data._id,
        },
      });

      history.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginContainer__login">
        <h3>Login</h3>
        <form className="loginContainer__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="loginContainer__input"
            autoFocus
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
          <button
            className="loginContainer__button"
            type="submit"
            disabled={!email || password.length < 6}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  style={{ marginRight: ".5rem" }}
                />
                <span>Login</span>
              </>
            )}
          </button>
        </form>
        <Link to="/forgot-password" className="loginContainer">
          Forgot Password?
        </Link>
        <button className="loginContainer__button" onClick={handleGoogleLogin}>
          <FontAwesomeIcon icon={faGoogle} style={{ marginRight: ".5rem" }} />
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
