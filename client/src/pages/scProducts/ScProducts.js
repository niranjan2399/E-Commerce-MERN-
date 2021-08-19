import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import ProductCard from "../../components/productCard/ProductCard";
import { getSub } from "../../utils/sub";
import WarningDiv from "../../components/warning/WarningDiv";

const ScProducts = () => {
  const [scProd, setScProd] = useState(null);
  const slug = useParams().slug;
  let scName = useRef();

  useEffect(() => {
    (async () => {
      const res = await getSub(slug);
      scName.current = res.data.sub[0].name;
      setScProd(res.data.products);
    })();
  }, [slug]);

  return (
    <>
      <Navbar />
      {scProd && (
        <div className="catProdContainer">
          {scProd.length > 0 ? (
            <div className="catProdContainer__title">
              {scProd.length + " products in " + scName.current}
            </div>
          ) : (
            <div className="catProdContainer__warninf">
              <WarningDiv
                message={"No Products Found in Sub Category " + scName.current}
              />
            </div>
          )}
          <div className="catProdContainer__main">
            {scProd.map((p) => {
              return <ProductCard product={p} key={p._id} />;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ScProducts;
