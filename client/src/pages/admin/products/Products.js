import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import "./products.scss";
// import CustomSelect from "../../../components/customSelect/CustomSelect";
import ProductCard from "../../../components/productCard/ProductCard";
import { listProducts } from "../../../utils/product";

function Products() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await listProducts(10);
      setProducts(res.data);
    })();
  }, []);

  return (
    <>
      <Navbar />
      <div className="productContainer">
        <AdminSidebar />
        <div className="productContainer__main">
          <div className="productContainer__top">
            <h2>Products</h2>
            <Link
              to="/admin/products/new"
              className="productContainer__newButton"
            >
              Create New Product
            </Link>
          </div>
          <div className="productContainer__grid">
            {products &&
              products.map((product) => {
                return (
                  <ProductCard
                    key={product._id}
                    setProducts={setProducts}
                    product={product}
                  />
                );
              })}
          </div>
          {/* <CustomSelect /> */}
        </div>
      </div>
    </>
  );
}

export default Products;
