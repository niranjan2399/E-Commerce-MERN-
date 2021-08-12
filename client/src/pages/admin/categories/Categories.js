import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import CategoryForm from "../../../components/categoryForm/CategoryForm";
import Navbar from "../../../components/navbar/Navbar";
import Overlay from "../../../components/overlay/Overlay";
import { Add, Edit, Delete, Warning, ExpandMore } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { getCategories, removeCategory } from "../../../utils/category";
import "./categories.scss";
import { useSelector } from "react-redux";
import LocalSearch from "../../../components/LocalSearch/LocalSearch";
import { toast } from "react-toastify";
import SubCategory from "../../../components/subcategory/SubCategory";
import { getSubs } from "../../../utils/sub";

function Categories() {
  const [subCategories, setSubCategories] = useState(null);
  const [categories, setCategories] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [formProps, setFormProps] = useState({
    title: "Create New Category",
    type: "category",
    method: "new",
  });
  const overlay = useRef();
  const form = useRef();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    (async () => {
      const resSub = await getSubs();

      setSubCategories(resSub.data);
    })();

    return () => {
      setSubCategories();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getCategories();

      setCategories(res.data);
    })();

    return () => {
      setCategories();
    };
  }, []);

  const handleViewForm = (e) => {
    if (e.currentTarget.getAttribute("data-identifier") === "newCategory") {
      setFormProps({
        title: "Create New Category",
        type: "category",
        method: "new",
        function: { setCategories },
      });
    } else if (e.currentTarget.getAttribute("data-identifier") === "sub") {
      setFormProps({
        title: "Create New Sub-Category",
        type: "sub",
        method: "new",
        function: { setSubCategories },
        objectid: e.currentTarget.getAttribute("data-objectid"),
        categories: categories,
      });
    } else {
      setFormProps({
        title: "Edit Category",
        type: "category",
        method: "update",
        function: { setCategories },
        slug: e.currentTarget.getAttribute("data-selector"),
      });
    }

    overlay.current.classList.add("reveal");
    form.current.classList.add("reveal");
  };

  const deleteCategory = async (e) => {
    const slug = e.currentTarget.getAttribute("data-selector");

    try {
      await removeCategory(slug, user.token);

      setCategories((pre) => {
        return pre.filter((p) => p.slug !== slug);
      });

      toast.info("Category deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const viewHideSub = (e) => {
    const currentDiv = e.currentTarget;
    const subDiv = e.currentTarget.nextSibling;
    const childOfSub = subDiv.firstChild;

    if (childOfSub) {
      if (subDiv.hasAttribute("style")) {
        subDiv.removeAttribute("style");
        childOfSub && currentDiv.removeAttribute("style");
      } else {
        subDiv.setAttribute("style", "height: fit-content");
        childOfSub && currentDiv.setAttribute("style", "margin-bottom: .5rem");
      }
    } else {
      toast.warn("No SubCategory Present");
    }
  };

  return (
    <>
      <Navbar />
      <div className="categoryContainer">
        <AdminSidebar />
        <div className="categoryContainer__main">
          <Overlay overlayRef={overlay} formRef={form} />
          <div ref={form} className="categoryContainer__form">
            <CategoryForm {...formProps} overlayRef={overlay} formRef={form} />
          </div>
          <div className="categoryContainer__top">
            <h2 className="categoryContainer__title">Categories</h2>
            <button data-identifier="newCategory" onClick={handleViewForm}>
              <Add style={{ marginRight: ".5rem" }} />
              Create New Category
            </button>
          </div>
          <LocalSearch
            sendClass="categoryContainer__mid"
            keyword={keyword}
            setKeyword={setKeyword}
            placeholder="Search for Categories"
          />
          {categories && (
            <div className="categoryContainer__bottom">
              {categories.filter((c) =>
                c.name.toLowerCase().includes(keyword.toLowerCase())
              ).length > 0 ? (
                categories
                  .filter((c) =>
                    c.name.toLowerCase().includes(keyword.toLowerCase())
                  )
                  .map((category) => {
                    return (
                      <div
                        className="categoryContainer__category"
                        key={category._id}
                      >
                        <div
                          className="categoryContainer__upper"
                          onClick={viewHideSub}
                        >
                          <div className="categoryContainer__left">
                            <ExpandMore
                              style={{
                                marginRight: ".75rem",
                              }}
                            />
                            {category.name}
                          </div>
                          <div className="categoryContainer__right">
                            <IconButton
                              style={{ width: "1.75rem", height: "1.75rem" }}
                              onClick={handleViewForm}
                              data-identifier="sub"
                              data-objectid={category._id}
                            >
                              <Add style={{ color: "#1dd1a1" }} />
                            </IconButton>
                            <IconButton
                              style={{ width: "1.75rem", height: "1.75rem" }}
                              onClick={handleViewForm}
                              data-selector={category.slug}
                            >
                              <Edit
                                style={{
                                  color: "#74b9ff",
                                  fontSize: "1.25rem",
                                }}
                              />
                            </IconButton>
                            <IconButton
                              style={{ width: "1.75rem", height: "1.75rem" }}
                              onClick={deleteCategory}
                              data-selector={category.slug}
                            >
                              <Delete
                                style={{
                                  color: "#ff7675",
                                  fontSize: "1.25rem",
                                }}
                              />
                            </IconButton>
                          </div>
                        </div>
                        <SubCategory
                          parent={category._id}
                          subCategories={subCategories}
                          setSubCategories={setSubCategories}
                        />
                      </div>
                    );
                  })
              ) : (
                <div className="categoryContainer__warning">
                  <Warning style={{ color: "yellow", marginRight: "1rem" }} />
                  No result matches to your search
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Categories;
