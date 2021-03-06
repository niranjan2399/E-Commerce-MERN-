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
import { currentUser } from "./utils/auth";
import AdminRoute from "./components/routes/AdminRoute";

import Home from "./pages/home/Home";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import RegisterComplete from "./pages/auth/registerComplete/RegisterComplete";
import ForgotPassword from "./pages/auth/forgotPassword/ForgotPassword";
import History from "./pages/user/history/History";
import Password from "./pages/user/password/Password";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import UserRoute from "./components/routes/UserRoute";
import Categories from "./pages/admin/categories/Categories";
import Products from "./pages/admin/products/Products";
import NewProduct from "./pages/admin/newProduct/NewProduct";
import ProductUpdate from "./pages/admin/ProductUpdate";
import Product from "./pages/product/Product";
import CategoryProducts from "./pages/categoryProducts/CategoryProducts";
import ScProducts from "./pages/scProducts/ScProducts";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Coupon from "./pages/admin/coupons/Coupon";
import Payment from "./pages/payment/Payment";
import Wishlist from "./pages/user/wishlist/Wishlist";

function App() {
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

  return (
    <Router>
      <ToastContainer />
      <Switch>
        <Route path="/" exact render={() => <Home />} />
        <Route path="/login" exact render={() => <Login />} />
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
        <Route path="/product/:slug" exact render={() => <Product />} />
        <Route
          path="/category/:slug"
          exact
          render={() => <CategoryProducts />}
        />
        <Route path="/subcategory/:slug" exact render={() => <ScProducts />} />
        <Route path="/shop" exact render={() => <Shop />} />
        <Route path="/cart" exact render={() => <Cart />} />

        {/* user Routes */}
        <UserRoute path="/user/history" exact component={History} />
        <UserRoute path="/user/password" exact component={Password} />
        <UserRoute path="/checkout" exact component={Checkout} />
        <UserRoute path="/payment" exact component={Payment} />
        <UserRoute path="/user/wishlist" exact component={Wishlist} />

        {/* admin Routes */}
        <AdminRoute exact path="/admin/dashboard" component={Dashboard} />
        <AdminRoute exact path="/admin/categories" component={Categories} />
        <AdminRoute exact path="/admin/products" component={Products} />
        <AdminRoute exact path="/admin/products/new" component={NewProduct} />
        <AdminRoute
          exact
          path="/admin/products/update/:slug"
          component={ProductUpdate}
        />
        <AdminRoute exact path="/admin/coupons" component={Coupon} />
      </Switch>
    </Router>
  );
}

export default App;
