import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { createCoupon, listCoupons, removeCoupon } from "../../../utils/coupon";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import Overlay from "../../../components/overlay/Overlay";
import "react-datepicker/dist/react-datepicker.css";
import { IconButton } from "@material-ui/core";
import { Close, Delete } from "@material-ui/icons";
import "./coupon.scss";
import { useSelector } from "react-redux";

const Coupon = () => {
  const [coupons, setCoupons] = useState(null);
  const { user } = useSelector((state) => ({ ...state }));
  const overlay = useRef();
  const form = useRef();

  useEffect(() => {
    (async () => {
      const coupons = await listCoupons();
      setCoupons(coupons.data);
    })();
  }, []);

  const handleDelete = async (e) => {
    const couponId = e.currentTarget.dataset.coupon_id;
    try {
      await removeCoupon(couponId, user.token);
      setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
      toast.success("Coupon deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Can't delete coupon!!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="couponContainer">
        <AdminSidebar />
        <div className="couponContainer__right">
          <Overlay overlayRef={overlay} formRef={form} />
          <div ref={form} className="couponContainer__form">
            <CouponForm
              setCoupons={setCoupons}
              overlayRef={overlay}
              formRef={form}
            />
          </div>
          <div>
            <h2>Coupons</h2>
            <button>Create New Coupon</button>
          </div>
          <hr />
          <div>
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Expiry</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              {coupons &&
                coupons.map((coupon) => {
                  return (
                    <tbody key={coupon._id}>
                      <tr>
                        <td>{coupon.name}</td>
                        <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                        <td>{coupon.discount}</td>
                        <td>
                          <IconButton
                            data-coupon_id={coupon._id}
                            onClick={handleDelete}
                          >
                            <Delete />
                          </IconButton>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const CouponForm = ({ overlayRef, formRef, setCoupons }) => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newCoupon = await createCoupon(
        { name, expiry, discount },
        user.token
      );
      console.log(newCoupon);
      setName("");
      setExpiry("");
      setDiscount("");
      setLoading(false);
      setCoupons((c) => [...c, newCoupon.data]);

      toast.success("Coupon created successfully");
    } catch (err) {
      toast.error("Coupon creation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="couponForm__top">
        <span>Create New Coupon</span>
        <IconButton>
          <Close />
        </IconButton>
      </div>
      <input
        type="text"
        value={name}
        autoFocus
        placeholder="Coupon Name"
        required
        onChange={(e) => setName(e.target.value.toUpperCase())}
      />
      <input
        type="number"
        value={discount}
        placeholder="Discount %"
        required
        onChange={(e) => setDiscount(e.target.value)}
      />
      <div className="couponForm__dateGroup">
        <DatePicker
          selected={new Date()}
          value={expiry}
          placeholderText="Expiry"
          minDate={Date.now()}
          name="date"
          required
          onChange={(date) => setExpiry(date)}
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default Coupon;
