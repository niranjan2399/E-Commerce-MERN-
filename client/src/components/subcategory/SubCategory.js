import React from "react";
import { IconButton } from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";
import { toast } from "react-toastify";
import { getSubs, removeSub } from "../../utils/sub";
import "./subCategory.scss";
import { useSelector } from "react-redux";

function SubCategory({ setSubCategories, subCategories, parent }) {
  const { user } = useSelector((state) => ({ ...state }));

  const handleViewForm = () => {};

  const deleteSub = async (e) => {
    const slug = e.currentTarget.getAttribute("data-selector");

    await removeSub(slug, user.token);

    setSubCategories((pre) => {
      return pre.filter((p) => {
        return p.slug !== slug;
      });
    });
    toast.success("SubCategory deleted");
    try {
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="subContainer">
      {subCategories &&
        subCategories
          .filter((sub) => sub.parent === parent)
          .map((sub) => {
            return (
              <div className="subContainer__main" key={sub._id}>
                <div className="subContainer__left">{sub.name}</div>
                <div className="subContainer__right">
                  <IconButton
                    style={{ width: "1.75rem", height: "1.75rem" }}
                    onClick={handleViewForm}
                    // data-selector={category.slug}
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
                    onClick={deleteSub}
                    data-selector={sub.slug}
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
            );
          })}
    </div>
  );
}

export default SubCategory;
