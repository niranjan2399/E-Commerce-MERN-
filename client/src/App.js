import { useEffect, useState } from "react";
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
import { currentUser, currentAdmin } from "./utils/auth";

import Home from "./pages/home/Home";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import RegisterComplete from "./pages/auth/registerComplete/RegisterComplete";
import ForgotPassword from "./pages/auth/forgotPassword/ForgotPassword";
import History from "./pages/user/history/History";
import LoadingToRedirect from "./components/loadingToRedirect/LoadingToRedirect";
import Password from "./pages/user/password/Password";
import Dashboard from "./pages/admin/dashboard/Dashboard";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const tokenId = await user.getIdTokenResult();
        const res = await currentUser(tokenId.token);
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

  useEffect(() => {
    if (user) {
      const isAdmin = async () => {
        try {
          await currentAdmin(user.token);
          setIsAdmin(true);
        } catch (err) {
          console.log(err);
          setIsAdmin(false);
        }
      };
      isAdmin();
    }
  }, [user]);

  return (
    <Router>
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
          path="/register/complete"
          exact
          render={() => (user ? <Redirect to="/" /> : <RegisterComplete />)}
        />
        <Route
          path="/forgot-password"
          exact
          render={() => (user ? <Redirect to="/" /> : <ForgotPassword />)}
        />

        {/* user Routes */}
        <Route
          path="/user/history"
          exact
          render={() => (user ? <History /> : <LoadingToRedirect />)}
        />
        <Route
          path="/user/password"
          exact
          render={() => (user ? <Password /> : <LoadingToRedirect />)}
        />

        {/* admin Routes */}
        <Route
          path="/admin/dashboard"
          exact
          render={() => (isAdmin ? <Dashboard /> : <LoadingToRedirect />)}
        />
      </Switch>
    </Router>
  );
}

export default App;
