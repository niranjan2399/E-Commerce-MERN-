import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { createCoupon, listCoupons, removeCoupon } from "../../../utils/coupon";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import Overlay from "../../../components/overlay/Overlay";
import "react-datepicker/dist/react-datepicker.css";
import { IconButton } from "@material-ui/core";
import { Close, Delete, Add } from "@material-ui/icons";
import "./coupon.scss";
import { useSelector } from "react-redux";
import { formHide } from "../../../utils/animate";

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

    return () => {
      setCoupons(null);
    };
  }, []);

  const handleDelete = async (e) => {
    const couponId = e.currentTarget.dataset.coupon_id;
    try {
      await removeCoupon(couponId, user.token);
      setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
      toast.success("Coupon Deleted Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Can't Delete Coupon!!");
    }
  };

  const handleViewForm = () => {
    overlay.current.classList.add("reveal");
    form.current.classList.add("reveal");
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
          <div className="couponContainer__top">
            <h2 className="couponContainer__title">Coupons</h2>
            <button onClick={handleViewForm}>
              <Add style={{ marginRight: ".5rem" }} />
              Create New Coupon
            </button>
          </div>
          <div className="couponContainer__bottom">
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Expiry</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              {coupons &&
                coupons.map((coupon) => {
                  return (
                    <tbody key={coupon._id}>
                      <tr>
                        <td>{coupon.name}</td>
                        <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                        <td>{coupon.discount}%</td>
                        <td>
                          <IconButton
                            className="icon"
                            style={{ width: "2.5rem", height: "2.5rem" }}
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
  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    formHide(overlayRef, formRef);

    try {
      const newCoupon = await createCoupon(
        { name, expiry, discount },
        user.token
      );
      console.log(newCoupon);
      setName("");
      setExpiry("");
      setDiscount("");
      setCoupons((c) => [...c, newCoupon.data]);

      toast.success("Coupon Created Successfully");
    } catch (err) {
      toast.error("Coupon Creation Failed");
    }
  };

  return (
    <div className="couponForm__container">
      <div className="couponForm__top">
        <span className="couponForm__head">Create New Coupon</span>
        <IconButton
          style={{ width: "2.5rem", height: "2.5rem" }}
          onClick={() => formHide(overlayRef, formRef)}
        >
          <Close />
        </IconButton>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="inputContainer"
          type="text"
          value={name}
          autoFocus
          placeholder="Coupon Name"
          required
          onChange={(e) => setName(e.target.value.toUpperCase())}
        />
        <input
          className="inputContainer"
          type="number"
          value={discount}
          placeholder="Discount %"
          required
          onChange={(e) => setDiscount(e.target.value)}
        />
        <div className="couponForm__dateGroup">
          <DatePicker
            className="inputContainer"
            selected={new Date()}
            value={expiry}
            placeholderText="Expiry"
            minDate={Date.now()}
            name="date"
            required
            onChange={(date) => setExpiry(date)}
          />
        </div>
        <button className="submit__button" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default Coupon;
