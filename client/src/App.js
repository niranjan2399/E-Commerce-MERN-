import "./app.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";

import NavBar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import RegisterComplete from "./pages/auth/registerComplete/RegisterComplete";
import { useEffect } from "react";
import ForgotPassword from "./pages/auth/forgotPassword/ForgotPassword";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const tokenId = await user.getIdTokenResult();

        dispatch({
          type: "LOGIN",
          payload: {
            email: user.email,
            token: tokenId.token,
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
          render={() => (user ? <Home /> : <Login />)}
        />
        <Route
          path="/register"
          exact
          render={() => (user ? <Home /> : <Register />)}
        />
        <Route
          path="/register/complete"
          exact
          render={() => (user ? <Home /> : <RegisterComplete />)}
        />
        <Route
          path="/forgot-password"
          exact
          render={() => (user ? <Home /> : <ForgotPassword />)}
        />
      </Switch>
    </Router>
  );
}

export default App;
