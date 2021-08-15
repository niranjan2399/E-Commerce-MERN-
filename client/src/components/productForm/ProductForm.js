import React from "react";

function ProductForm({ values, handleSubmit, handleChange }) {
  let {
    title,
    description,
    price,
    categories,
    quantity,
    colors,
    subListAll,
    sizes,
  } = values;

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
      <select name="shipping" value="" onChange={handleChange}>
        <option disabled value="" hidden>
          Please Select
        </option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <label htmlFor="quantity">Quantity</label>
      <input
        type="number"
        name="quantity"
        value={quantity}
        onChange={handleChange}
      />
      <label htmlFor="color">Colors</label>
      <select
        name="color"
        multiple
        onChange={handleChange}
        required
        data-identifier="multipleColor"
      >
        <option value="">Please Select</option>
        {colors.map((color, i) => {
          return (
            <option value={color} key={i}>
              {color}
            </option>
          );
        })}
      </select>
      <label htmlFor="size">Size</label>
      <select
        name="size"
        multiple
        onChange={handleChange}
        required
        data-identifier="multipleSize"
      >
        <option value="">Please Select</option>
        {sizes.map((size, i) => {
          return (
            <option value={size} key={i}>
              {size}
            </option>
          );
        })}
      </select>
      <label htmlFor="category">Category</label>
      <select name="category" value="" onChange={handleChange}>
        <option hidden disabled value="">
          Please Select
        </option>
        {categories &&
          categories.map((category, i) => {
            return (
              <option value={category._id} key={i}>
                {category.name}
              </option>
            );
          })}
      </select>
      {subListAll && (
        <>
          <label htmlFor="subs">Sub Category</label>
          <select
            name="subs"
            className="npContainer__subs"
            multiple
            onChange={handleChange}
            data-identifier="multipleSubs"
          >
            <option value="">Please Select</option>
            {subListAll.map((sub, i) => {
              return (
                <option value={sub._id} key={i}>
                  {sub.name}
                </option>
              );
            })}
          </select>
        </>
      )}
      <button type="submit">Save Product</button>
    </form>
  );
}

export default ProductForm;
