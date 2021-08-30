import React, { useEffect, useState } from "react";
import CustomCheckbox from "../customCheckbox/CustomCheckbox";
import CustomSelect from "../customSelect/CustomSelect";

function ProductForm({ values, handleSubmit, handleChange, setValues }) {
  let {
    title,
    description,
    price,
    category,
    categories,
    shipping,
    quantity,
    colors,
    subListAll,
    sizes,
  } = values;
  const [shippingValue, setShippingValue] = useState();
  const [categoryValue, setCategoryValue] = useState();

  useEffect(() => {
    if (values) {
      setShippingValue(shipping);
      setCategoryValue(category._id);
    }
  }, [values, category, shipping]);

  const handleCustomSelect = (e) => {
    const type = e.currentTarget.dataset.name;
    if (type === "shipping") {
      setShippingValue(e.currentTarget.dataset.value);
    } else if (type === "category") {
      setCategoryValue(e.currentTarget.dataset.value);
    }
    setValues({
      ...values,
      [e.currentTarget.dataset.name]: e.currentTarget.dataset.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="npContainer__form">
      <label htmlFor="title">Title</label>
      <input
        type="text"
        name="title"
        value={title}
        required
        autoFocus
        onChange={handleChange}
      />
      <label htmlFor="description">Description</label>
      <textarea
        type="text"
        name="description"
        rows={6}
        value={description}
        onChange={handleChange}
      />
      <label htmlFor="price">Price</label>
      <input type="number" name="price" value={price} onChange={handleChange} />
      <label htmlFor="shipping">Shipping</label>
      <CustomSelect
        options={[
          { value: "Yes", title: "Yes", name: "shipping" },
          { value: "No", title: "No", name: "shipping" },
        ]}
        handleCustomSelect={handleCustomSelect}
        value={shippingValue}
      />
      <label htmlFor="quantity">Quantity</label>
      <input
        type="number"
        name="quantity"
        value={quantity}
        onChange={handleChange}
      />
      <label>Colors</label>
      {/* <select
        multiple
        value={values.color}
        onChange={handleChange}
        required
        data-
      > */}
      {/* <option value="">Please Select</option> */}
      <div className="checkbox__div">
        {colors.map((color, i) => {
          return (
            <CustomCheckbox
              key={i}
              label={color}
              name="color"
              value={color}
              identifier="multipleColor"
              onChange={handleChange}
            />
            // <option value={color} key={i}>
            //   {color}
            // </option>
          );
        })}
      </div>
      {/* </select> */}
      <label htmlFor="size">Size</label>
      {/* <select
        multiple
        value={values.size}
        onChange={handleChange}
        required
        data-
        >
      <option value="">Please Select</option> */}
      <div className="checkbox__div">
        {sizes.map((size, i) => {
          return (
            <CustomCheckbox
              name="size"
              label={size}
              value={size}
              key={i}
              onChange={handleChange}
              identifier="multipleSize"
            />
            // <option value={size} key={i}>
            //   {size}
            // </option>
          );
        })}
      </div>
      {/* </select> */}
      {categories && (
        <div>
          <label>Categories</label>
          <CustomSelect
            options={categories.map((category) => {
              return {
                value: `${category._id}`,
                title: `${category.name}`,
                name: "category",
              };
            })}
            handleCustomSelect={handleCustomSelect}
            value={categoryValue}
          />
        </div>
      )}
      {subListAll && (
        <>
          <label htmlFor="subs">Sub Category</label>
          {/* <select
            value={values.subs}
            className="npContainer__subs"
            multiple
            onChange={handleChange}
            data-
            >
          <option value="">Please Select</option> */}
          <div className="checkbox__div checkbox__div--sub">
            {subListAll.map((sub, i) => {
              return (
                <CustomCheckbox
                  label={sub.name}
                  name="subs"
                  value={sub._id}
                  identifier="multipleSubs"
                  onChange={handleChange}
                  key={i}
                />
                // <option value={sub._id} key={i}>
                //   {sub.name}
                // </option>
              );
            })}
          </div>
          {/* </select> */}
        </>
      )}
      <button type="submit">Save Product</button>
    </form>
  );
}

export default ProductForm;
