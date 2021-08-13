import React, { useEffect, useState } from "react";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { createCategory, updateCategory } from "../../utils/category";
import { createSub, updateSub } from "../../utils/sub";
import { useSelector } from "react-redux";
import "./categoryForm.scss";
import { formHide } from "../../utils/animate";
import { toast } from "react-toastify";

function CategoryForm({ title, type, method, overlayRef, formRef, ...props }) {
  const [defaultValue, setDefaultValue] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (props.objectid) {
      setDefaultValue(props.objectid);
    } else if (props.parentid) {
      setDefaultValue(props.parentid);
    }

    return () => {
      setDefaultValue("");
    };
  }, [props.objectid, props.parentid]);

  const handleNew = async (e) => {
    e.preventDefault();

    if (type !== "sub") {
      try {
        const res = await createCategory(user.token, { name: categoryName });
        props.function.setCategories((pre) => {
          return [...pre, res.data];
        });
        toast.success(`Category "${res.data.name}" is created`);
      } catch (err) {
        toast.error(err.response.data);
      }
    } else {
      try {
        const res = await createSub(user.token, {
          name: categoryName,
          parent: props.objectid,
        });

        props.function.setSubCategories((pre) => {
          return [...pre, res.data];
        });

        toast.success(`SubCategory ${categoryName} created`);
      } catch (err) {
        toast.error(err.response.data);
      }
    }
    formHide(overlayRef, formRef);
    setCategoryName("");
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const slug = props.slug;

    if (type !== "sub") {
      try {
        const res = await updateCategory(slug, user.token, {
          name: categoryName,
        });

        props.function.setCategories((pre) => {
          const data = pre.filter((p) => {
            return p.slug !== slug;
          });
          return [...data, res.data];
        });

        toast.success(`Category renamed to "${res.data.name}"`);
      } catch (err) {
        toast.error(err.response.data);
      }
    } else {
      try {
        const res = await updateSub(slug, user.token, {
          name: categoryName,
          parent: defaultValue,
        });
        console.log(res.data);

        props.function.setSubCategories((sub) => {
          const data = sub.filter((s) => {
            return s.slug !== slug;
          });
          return [...data, res.data];
        });

        toast.success(`SubCategory Updated`);
      } catch (err) {
        toast.error(err.response.data);
      }
    }
    formHide(overlayRef, formRef);
    setCategoryName("");
  };

  const handleSelect = (e) => {
    setDefaultValue(e.target.value);
  };

  return (
    <div className="categoryForm__container">
      <div className="categoryForm__top">
        <div className="categoryForm__head">{title}</div>
        <IconButton
          style={{ width: "2.5rem", height: "2.5rem" }}
          onClick={() => formHide(overlayRef, formRef)}
        >
          <Close />
        </IconButton>
      </div>
      <form onSubmit={method === "new" ? handleNew : handleChange}>
        <div className="inputContainer">
          {type === "sub" && (
            <select value={defaultValue} onChange={handleSelect}>
              {props.categories.map((category) => {
                return (
                  <option
                    value={category._id}
                    key={category._id}
                    {...(method === "new" && { disabled: true })}
                  >
                    {category.name}
                  </option>
                );
              })}
            </select>
          )}
          <input
            type="text"
            value={categoryName}
            placeholder="Name"
            required
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default CategoryForm;
