import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../components/userSidebar/UserSidebar";
import AdminSidebar from "../../components/adminSidebar/AdminSidebar";
import "./home.scss";
import ProductCard from "../../components/productCard/ProductCard";
import { getAccordingly } from "../../utils/product";
import {
  NavigateBefore,
  NavigateNext,
} from "@material-ui/icons";

function Home() {
  const { user } = useSelector((state) => ({ ...state }));
  const [newProducts, setNewProducts] = useState(null);
  const [bestSellers, setBestSellers] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getAccordingly("createdAt", "desc", 4);
      setNewProducts(res.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getAccordingly("sold", "desc", 4);
      setBestSellers(res.data);
    })();
  }, []);

  const scroll = (e) => {
    // const section = e.currentTarget.dataset.section;

  };

  return (
    <>
      <Navbar />
      <div className="homeContainer">
        {/* {user && user.role === "admin" ? <AdminSidebar /> : <UserSidebar />} */}
        <div className="homeContainer__main">
          {newProducts && (
            <section className="homeContainer__section">
              <div className="homeContainer__sectionTop">New Arrivals</div>
              <div className="homeContainer__sectionBottom">
                <div
                  className="homeContainer__scrollButtons"
                  data-type="left"
                  data-section="newProduct"
                  onClick={scroll}
                >
                  <NavigateBefore className="icons" />
                </div>
                <div className="homeContainer__sectionWrapper">
                  {newProducts.map((product) => {
                    return <ProductCard product={product} key={product.slug} />;
                  })}
                  {newProducts.map((product) => {
                    return <ProductCard product={product} key={product.slug} />;
                  })}
                  {newProducts.map((product) => {
                    return <ProductCard product={product} key={product.slug} />;
                  })}
                </div>
                <div
                  className="homeContainer__scrollButtons"
                  data-type="right"
                  data-section="bestProduct"
                  onClick={scroll}
                >
                  <NavigateNext className="icons" />
                </div>
              </div>
            </section>
          )}
          {bestSellers && (
            <section className="homeContainer__section">
              <div className="homeContainer__sectionTop">Best Sellers</div>
              <div className="homeContainer__sectionBottom">
                <div
                  className="homeContainer__scrollButtons"
                  data-type="left"
                  onClick={scroll}
                >
                  <NavigateBefore className="icons" />
                </div>
                <div className="homeContainer__sectionWrapper">
                  {bestSellers.map((product) => {
                    return <ProductCard product={product} key={product.slug} />;
                  })}
                  {bestSellers.map((product) => {
                    return <ProductCard product={product} key={product.slug} />;
                  })}
                  {bestSellers.map((product) => {
                    return <ProductCard product={product} key={product.slug} />;
                  })}
                </div>
                <div
                  className="homeContainer__scrollButtons"
                  data-type="right"
                  onClick={scroll}
                >
                  <NavigateNext className="icons" />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
