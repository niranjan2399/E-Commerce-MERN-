import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import { createProduct } from "../../../utils/product";
import "./newProduct.scss";
import { toast } from "react-toastify";
import ProductForm from "../../../components/productForm/ProductForm";
import { getCategories } from "../../../utils/category";
import { getForCategory } from "../../../utils/sub";

const initialValues = {
  title: "",
  slug: "",
  description: "",
  price: "",
  category: "",
  categories: null,
  quantity: "",
  sold: "",
  shipping: "",
  color: [],
  subs: [],
  subListAll: null,
  colors: ["Black", "Red", "Silver", "Green", "Blue"],
  size: [],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
};

function NewProduct() {
  const { user } = useSelector((state) => ({ ...state }));
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    (async () => {
      const res = await getCategories();
      setValues((pre) => {
        return { ...pre, categories: res.data };
      });
    })();
  }, []);

  useEffect(() => {
    values.category &&
      (async () => {
        const res = await getForCategory(values.category);
        setValues((pre) => {
          return { ...pre, subListAll: res.data };
        });
      })();
  }, [values.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createProduct(values, user.token);
      console.log(res.data);

      toast.success("Product Created");
      window.history.back();
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleChange = (e) => {
    const tempId = e.target.dataset.identifier;
    if (tempId === "multipleColor") {
      [...e.target.selectedOptions].forEach((selected) => {
        values.color.includes(selected.value) ||
          values.color.push(selected.value);
      });
    } else if (tempId === "multipleSize") {
      [...e.target.selectedOptions].forEach((selected) => {
        values.size.includes(selected.value) ||
          values.size.push(selected.value);
      });
    } else if (tempId === "multipleSubs") {
      [...e.target.selectedOptions].forEach((selected) => {
        values.subs.includes(selected.value) ||
          values.subs.push(selected.value);
      });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <Navbar />
      <div className="npContainer">
        <AdminSidebar />
        <div className="npContainer__main">
          <div className="npContainer__top">
            <div className="npContainer__title">New Product</div>
          </div>
          <div className="npContainer__bottom">
            <ProductForm
              values={values}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default NewProduct;
