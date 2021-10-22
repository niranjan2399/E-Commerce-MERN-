import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import UserSidebar from "../../../components/userSidebar/UserSidebar";
import axios from "../../../axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Delete } from "@material-ui/icons";
import { toast } from "react-toastify";
import WarningDiv from "../../../components/warning/WarningDiv";
import "./wishlist.scss";
import { CircularProgress } from "@material-ui/core";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    (async () => {
      const res = await axios.get("/user/wishlist", {
        headers: {
          authtoken: user.token,
        },
      });

      setWishlist(res.data.wishlist);
    })();

    return () => {
      setWishlist(null);
    };
  }, [user]);

  const handleUpdateWishlist = async (e) => {
    try {
      const productId = e.currentTarget.dataset.product_id;

      const res = await axios.put(
        `/user/wishlist/${productId}`,
        {},
        {
          headers: {
            authtoken: user.token,
          },
        }
      );

      if (res.data.ok) {
        setWishlist(wishlist.filter((product) => product._id !== productId));
      }
    } catch (err) {
      toast.error(
        "Unable to remove product! Please reload or try again later."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="wlContainer">
        <UserSidebar />
        <div className="wlContainer__main">
          <h2 className="wlContainer__top">WishList</h2>
          <div className="wlContainer__bottom">
            {wishlist ? (
              wishlist.length ? (
                wishlist.map((product) => {
                  return (
                    <div key={product._id} className="wlContainer__productDiv">
                      <Link
                        to={`/product/${product.slug}`}
                        className="wlContainer__link"
                      >
                        {product.title}
                      </Link>
                      <div
                        className="wlContainer__icon"
                        data-product_id={product._id}
                        onClick={handleUpdateWishlist}
                      >
                        <Delete />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ width: "100%" }}>
                  <WarningDiv message="Wishlist Empty" />
                </div>
              )
            ) : (
              <CircularProgress
                style={{ width: "2rem", height: "2rem", color: "#8167a9" }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
