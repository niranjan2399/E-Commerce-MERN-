import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/app";
import { auth, googleAuthProvider } from "../../../firebase";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createUserOrUpdate, currentUser } from "../../../utils/auth";
import { CircularProgress } from "@material-ui/core";
import AuthWrapper from "../../../components/authWrapper/AuthWrapper";
import "./login.scss";
import { handleError } from "../../../utils/handleError";

function Login() {
  return <AuthWrapper children={<LoginForm />} />;
}

const LoginForm = () => {
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

      const resUser = await currentUser(tokenId.token);
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
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await auth.signInWithPopup(googleAuthProvider);

      const { user } = res;
      const tokenId = await user.getIdTokenResult();

      const resUser = await createUserOrUpdate(tokenId.token, {});
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
      toast.error(err.response.data);
    }
  };

  return (
    <div className="loginContainer__login">
      <span className="loginContainer__head">Login</span>
      <form className="loginContainer__form" onSubmit={handleSubmit}>
        <div className="loginContainer__inputContainer">
          <input
            type="text"
            className="loginContainer__input"
            autoFocus
            required
            value={email}
            onInvalidCapture={(e) => handleError(e)}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <label htmlFor="email">Email</label>
          <div className="loginContainer__inputBottom"></div>
        </div>
        <div className="loginContainer__inputContainer">
          <input
            type="password"
            name="password"
            className="loginContainer__input"
            id="password"
            required
            value={password}
            onInvalidCapture={(e) => handleError(e)}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="password"
          />
          <label htmlFor="password">Password</label>
          <div className="loginContainer__inputBottom"></div>
        </div>
        <button className="loginContainer__button simpleLogin" type="submit">
          {loading ? (
            <CircularProgress color="inherit" size="1rem" />
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
      <Link to="/forgot-password" className="loginContainer__fp">
        Forgot Password?
      </Link>
      <div className="loginContainer__loginDivider">
        <span>or</span>
      </div>
      <button
        className="loginContainer__button googleLogin"
        onClick={handleGoogleLogin}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="1.5rem"
          height="1.5rem"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        <span style={{ marginLeft: ".75rem" }}>Login with Google</span>
      </button>
    </div>
  );
};

export default Login;
