import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import ProductCard from "../../components/productCard/ProductCard";
import { getCategory } from "../../utils/category";
import WarningDiv from "../../components/warning/WarningDiv";
import "./categoryProducts.scss";

const CategoryProducts = () => {
  const [catProd, setCatProd] = useState(null);
  const slug = useParams().slug;
  let categoryName = useRef();

  useEffect(() => {
    (async () => {
      const res = await getCategory(slug);
      categoryName.current = res.data.category[0].name;
      setCatProd(res.data.products);
    })();
  }, [slug]);

  return (
    <>
      <Navbar />
      {catProd && (
        <div className="catProdContainer">
          {catProd.length > 0 ? (
            <div className="catProdContainer__title">
              {catProd.length + " products in " + categoryName.current}
            </div>
          ) : (
            <div className="catProdContainer__warninf">
              <WarningDiv
                message={
                  "No Products Found in Category " + categoryName.current
                }
              />
            </div>
          )}
          <div className="catProdContainer__main">
            {catProd.map((p) => {
              return <ProductCard product={p} key={p._id} />;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryProducts;
