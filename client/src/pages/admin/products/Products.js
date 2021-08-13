import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import "./products.scss";

function Products() {
  return (
    <>
      <Navbar />
      <div className="productContainer">
        <AdminSidebar />
        <div className="productContainer__main">
          <div className="productContainer__top">
            <div className="productContainer__title">Products</div>
            <Link to="/admin/products/new">Create New Product</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
