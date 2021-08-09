import { useEffect } from "react";
import "./app.scss";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import axios from "./axios";

import NavBar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import RegisterComplete from "./pages/auth/registerComplete/RegisterComplete";
import ForgotPassword from "./pages/auth/forgotPassword/ForgotPassword";
import History from "./pages/user/history/History";
import LoadingToRedirect from "./components/loadingToRedirect/LoadingToRedirect";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const tokenId = await user.getIdTokenResult();
        const res = await axios.post(`/user/${user.email}`);
        const [{ name, role, _id }] = res.data;

        dispatch({
          type: "LOGIN",
          payload: {
            email: user.email,
            token: tokenId.token,
            name,
            role,
            _id,
          },
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <Router>
      <NavBar />
      <ToastContainer />
      <Switch>
        <Route path="/" exact render={() => <Home />} />
        <Route
          path="/login"
          exact
          render={() => (user ? <Redirect to="/" /> : <Login />)}
        />
        <Route
          path="/register"
          exact
          render={() => (user ? <Redirect to="/" /> : <Register />)}
        />
        <Route
          path="/user/history"
          exact
          render={() => (user ? <History /> : <LoadingToRedirect />)}
        />
        <Route
          path="/register/complete"
          exact
          render={() => (user ? <Redirect to="/" /> : <RegisterComplete />)}
        />
        <Route
          path="/forgot-password"
          exact
          render={() => (user ? <Redirect to="/" /> : <ForgotPassword />)}
        />
      </Switch>
    </Router>
  );
}

export default App;
