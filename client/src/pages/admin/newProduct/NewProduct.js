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
import FileUpload from "../../../components/productForm/FileUpload";
import { Clear } from "@material-ui/icons";
import axios from "../../../axios";

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
  images: [],
  subs: [],
  subListAll: null,
  colors: ["Black", "Red", "Silver", "Green", "Blue"],
  size: [],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
};

function NewProduct() {
  const { user } = useSelector((state) => ({ ...state }));
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

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

        document
          .querySelector(".npContainer__subs")
          .scrollIntoView({ behavior: "smooth" });
      })();
  }, [values.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct(values, user.token);

      toast.success("Product Created");
      window.history.back();
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleChange = (e) => {
    const newValues = [];
    const tempId = e.target.dataset.identifier;
    if (tempId === "multipleColor") {
      [...e.target.selectedOptions].forEach((selected) => {
        newValues.push(selected.value);
      });
      setValues({ ...values, color: newValues });
    } else if (tempId === "multipleSize") {
      [...e.target.selectedOptions].forEach((selected) => {
        newValues.push(selected.value);
      });
      setValues({ ...values, size: newValues });
    } else if (tempId === "multipleSubs") {
      [...e.target.selectedOptions].forEach((selected) => {
        newValues.push(selected.value);
      });
      setValues({ ...values, subs: newValues });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const removeImage = async (e) => {
    const public_id = e.currentTarget.dataset.public_id;

    try {
      await axios.post(
        "/removeimages",
        { public_id },
        {
          headers: {
            authtoken: user.token,
          },
        }
      );

      const filteredImages = values.images.filter((image) => {
        return image.public_id !== public_id;
      });
      setValues({ ...values, images: filteredImages });
    } catch (err) {
      toast.error("Can't Remove Image");
    }
  };

  return (
    <>
      <Navbar />
      <div className="npContainer">
        <AdminSidebar />
        <div className="npContainer__main">
          <div className="npContainer__top">
            <h2>New Product</h2>
            <FileUpload
              values={values}
              setValues={setValues}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          <div className="npContainer__bottom">
            <div className="npContainer__imageDiv">
              {values.images.length > 0 ? (
                values.images.map((image) => {
                  return (
                    <div
                      className="npContainer__imagePreview"
                      key={image.public_id}
                    >
                      <img src={image.url} alt="" />
                      <div
                        className="npContainer__delete"
                        onClick={removeImage}
                        data-public_id={image.public_id}
                      >
                        <Clear style={{ fontSize: ".75rem" }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="npContainer__imagePreview npContainer__imagePreview--info">
                  Please select product images to preview
                </div>
              )}
            </div>
            <ProductForm
              values={values}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              setValues={setValues}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default NewProduct;
