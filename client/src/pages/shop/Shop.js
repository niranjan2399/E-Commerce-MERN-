import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { getByFilter, listProducts } from "../../utils/product";
import { ExpandMoreOutlined } from "@material-ui/icons";
import {
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ProductCard from "../../components/productCard/ProductCard";
import WarningDiv from "../../components/warning/WarningDiv";
import "./shop.scss";

const Shop = () => {
  const [products, setProducts] = useState(null);
  const [price, setPrice] = useState([10, 300]);
  const [displaySearch, setDisplaySearch] = useState(false);
  const { search } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const { text } = search;

  useEffect(() => {
    if (displaySearch === false) {
      (async () => {
        const res = await listProducts(12);
        setProducts(res.data);
      })();
    }
  }, [displaySearch]);

  useEffect(() => {
    const filteredProducts = setTimeout(async () => {
      if (text === "") {
        setDisplaySearch(false);
      } else {
        const res = await getByFilter({ text });
        setDisplaySearch(true);
        setProducts(res.data);
      }
    }, 300);

    return () => clearTimeout(filteredProducts);
  }, [text]);

  const handlePrice = async () => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setDisplaySearch(true);

    const res = await getByFilter({ price });
    setProducts(res.data);
  };

  return (
    <>
      <Navbar />
      <div className="shop">
        <div className="shop__left">
          <div className="shop__filterHead">Filter Products</div>
          <Accordion square={true} style={{ fontSize: ".9rem" }}>
            <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
              Price
            </AccordionSummary>
            <AccordionDetails>
              <Slider
                min={10}
                max={300}
                value={price}
                onChange={(_, newValue) => setPrice(newValue)}
                onChangeCommitted={handlePrice}
                valueLabelDisplay="auto"
                valueLabelFormat={(x) => `$${x}`}
              />
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="shop__right">
          {products && products.length > 0 ? (
            products.map((product) => {
              return <ProductCard product={product} key={product._id} />;
            })
          ) : (
            <div className="shop__warning">
              <WarningDiv
                message={
                  displaySearch
                    ? "Sorry, No Product Found Matching Your Search"
                    : "Sorry, No Products Found"
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;
