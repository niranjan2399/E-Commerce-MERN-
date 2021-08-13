import React, { useEffect, useState } from "react";
import { IconButton } from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";
import { toast } from "react-toastify";
import { removeSub } from "../../utils/sub";
import "./subCategory.scss";
import { useSelector } from "react-redux";
import WarningDiv from "../warning/WarningDiv";

function SubCategory({
  setSubCategories,
  subCategories,
  parent,
  handleViewForm,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const [sub, setSub] = useState(null);

  useEffect(() => {
    subCategories &&
      setSub(
        subCategories.filter((sub) => {
          return sub.parent === parent;
        })
      );

    return () => {
      setSub();
    };
  }, [subCategories, parent]);

  const deleteSub = async (e) => {
    const slug = e.currentTarget.dataset.selector;

    await removeSub(slug, user.token);

    setSubCategories((pre) => {
      return pre.filter((p) => {
        return p.slug !== slug;
      });
    });
    toast.success("SubCategory deleted");
    try {
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <div className="subContainer">
      {sub && sub.length > 0 ? (
        sub.map((sub) => {
          return (
            <div className="subContainer__main" key={sub._id}>
              <div className="subContainer__left">{sub.name}</div>
              <div className="subContainer__right">
                <IconButton
                  style={{ width: "1.75rem", height: "1.75rem" }}
                  onClick={handleViewForm}
                  data-identifier="updateSub"
                  data-parentid={sub.parent}
                  data-slug={sub.slug}
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
        })
      ) : (
        <WarningDiv message="No SubCategory present" />
      )}
    </div>
  );
}

export default SubCategory;
