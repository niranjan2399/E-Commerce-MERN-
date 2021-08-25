import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../components/userSidebar/UserSidebar";
import AdminSidebar from "../../components/adminSidebar/AdminSidebar";
import "./home.scss";
import ProductCard from "../../components/productCard/ProductCard";
import { getAccordingly } from "../../utils/product";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import CategoryList from "../../components/category/CategoryList";
import { getCategories } from "../../utils/category";
import { getSubs } from "../../utils/sub";
import HomePageScrollSection from "../../components/homePageScrollSection/HomePageScrollSection";

function Home() {
  const { user } = useSelector((state) => ({ ...state }));
  const [newProducts, setNewProducts] = useState(null);
  const [bestSellers, setBestSellers] = useState(null);
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getAccordingly("createdAt", "desc", 4);
      setNewProducts(res.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getCategories();
      setCategories(res.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getSubs();
      setSubCategories(res.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getAccordingly("sold", "desc", 4);
      setBestSellers(res.data);
    })();
  }, []);

  return (
    <>
      <Navbar />
      <div className="homeContainer">
        {/* {user && user.role === "admin" ? <AdminSidebar /> : <UserSidebar />} */}
        <div className="homeContainer__main">
          {newProducts && <HomePageScrollSection products={newProducts} title='New Products'/>}
          {bestSellers && <HomePageScrollSection products={bestSellers} title='Best Sellers'/>}
          {categories && (
            <section className="homeContainer__section">
              <div className="homeContainer__sectionTop">Categories</div>
              <CategoryList list={categories} to="category" />
            </section>
          )}
          {subCategories && (
            <section className="homeContainer__section">
              <div className="homeContainer__sectionTop">SubCategories</div>
              <CategoryList list={subCategories} to="subcategory" />
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
