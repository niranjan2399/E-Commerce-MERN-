import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import "./products.scss";
import ProductCard from "../../../components/productCard/ProductCard";
import { listProducts } from "../../../utils/product";
import { Add } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";

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
              <Add style={{ marginRight: ".5rem" }} />
              Create New Product
            </Link>
          </div>
          <div className="productContainer__grid">
            {products ? (
              products.map((product) => {
                return (
                  <ProductCard
                    key={product._id}
                    setProducts={setProducts}
                    product={product}
                  />
                );
              })
            ) : (
              <div>
                <CircularProgress
                  style={{
                    color: "#8167a9",
                    width: "2rem",
                    height: "2rem",
                    marginTop: "2rem",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
