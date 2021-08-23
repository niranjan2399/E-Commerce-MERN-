import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCategories } from "../../utils/category";
import { getForCategory } from "../../utils/sub";
import { getProduct, updateProduct } from "../../utils/product";
import { toast } from "react-toastify";
import { Clear } from "@material-ui/icons";
import axios from "../../axios";
import { useParams } from "react-router";

import AdminSidebar from "../../components/adminSidebar/AdminSidebar";
import Navbar from "../../components/navbar/Navbar";
import ProductForm from "../../components/productForm/ProductForm";
import FileUpload from "../../components/productForm/FileUpload";

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

function ProductUpdate() {
  const [values, setValues] = useState(initialValues);
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const slug = useParams().slug;

  useEffect(() => {
    (async () => {
      const res = await getProduct(slug);

      setValues((val) => {
        return { ...val, ...res.data };
      });
    })();
  }, [slug]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateProduct(values.slug, values, user.token);

      toast.success("Product Updated");
      window.history.back();
    } catch (err) {
      toast.error(err.response.data);
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
            <h2>Update Product</h2>
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
                  No Images Present to Preview
                </div>
              )}
            </div>
            <ProductForm
              values={values}
              handleChange={handleChange}
              handleSubmit={handleUpdate}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductUpdate;
