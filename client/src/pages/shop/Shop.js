import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { getByFilter, listProducts } from "../../utils/product";
import { Slider, Checkbox, Box, Radio } from "@material-ui/core";
import ProductCard from "../../components/productCard/ProductCard";
import WarningDiv from "../../components/warning/WarningDiv";
import Accordion from "../../components/accordion/Accordion";
import { getCategories } from "../../utils/category";
import { Rating } from "@material-ui/lab";
import { labels } from "../../utils/starLabels";
import "./shop.scss";

const Shop = () => {
  const [products, setProducts] = useState(null);
  const [price, setPrice] = useState([10, 10]);
  const [displaySearch, setDisplaySearch] = useState(false);
  const [categories, setCategories] = useState(null);
  const [categoriesId, setCategoriesId] = useState([]);
  const [shipping, setShipping] = useState();
  const [color, setColor] = useState();
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(-1);
  const { search } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const { text } = search;
  const colorsData = ["Blue", "Red", "Green", "Black", "Silver"];

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
        setCategoriesId([]);
        setPrice([10, 10]);
        setValue(0);
        setShipping();
        setColor();

        const res = await getByFilter({ query: text });
        setDisplaySearch(true);
        setProducts(res.data);
      }
    }, 300);

    return () => clearTimeout(filteredProducts);
  }, [text]);

  useEffect(() => {
    (async () => {
      const res = await getCategories();
      setCategories(res.data);
    })();
  }, []);

  const handlePrice = async () => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesId([]);
    setShipping();
    setColor();
    setValue(0);
    setDisplaySearch(true);

    const res = await getByFilter({ price });
    setProducts(res.data);
  };

  const handleCategory = async (e) => {
    let sendData = [];
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([10, 10]);
    setValue(0);
    setShipping();
    setColor();

    if (categoriesId.includes(e.target.value)) {
      const sendData = categoriesId.filter((id) => id !== e.target.value);
      setCategoriesId([...sendData]);
    } else {
      setCategoriesId([...categoriesId, e.target.value]);
      sendData = [...categoriesId, e.target.value];
    }

    const res = await getByFilter({ category: sendData });
    setProducts(res.data);
  };

  const handleStarValue = async (_, val) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesId([]);
    setPrice([10, 10]);
    setShipping();
    setColor();

    const res = await getByFilter({ stars: val });
    setProducts(res.data);
    setValue(val);
  };

  const handleShipping = async (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesId([]);
    setPrice([10, 10]);
    setValue(0);
    setColor();

    const res = await getByFilter({ shipping: e.target.value });
    setProducts(res.data);
    setShipping(e.target.value);
  };

  const handleColor = async (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesId([]);
    setPrice([10, 10]);
    setValue(0);
    setShipping();

    const res = await getByFilter({ color: e.target.value });
    setProducts(res.data);
    setColor(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="shop">
        <div className="shop__left">
          <div className="shop__filterHead">Filter Products</div>
          <Accordion title="Price">
            <Slider
              min={10}
              max={300}
              value={price}
              onChange={(_, newValue) => setPrice(newValue)}
              onChangeCommitted={handlePrice}
              valueLabelDisplay="auto"
              valueLabelFormat={(x) => `$${x}`}
            />
          </Accordion>
          {categories && (
            <Accordion title="Category">
              <div>
                {categories.map((c, index) => {
                  return (
                    <div key={index}>
                      <Checkbox
                        disableRipple={true}
                        color="primary"
                        value={c._id}
                        onChange={handleCategory}
                        checked={categoriesId.includes(c._id)}
                      />
                      <label htmlFor={"ch" + index}>{c.name}</label>
                    </div>
                  );
                })}
              </div>
            </Accordion>
          )}
          <Accordion title="Ratings">
            <div className="shop__filterRatings">
              <Rating
                name="rating"
                value={value}
                size="large"
                onChange={handleStarValue}
                onChangeActive={(_, newHover) => {
                  setHover(newHover);
                }}
              />
              {value !== null && (
                <Box
                  margin="0.25rem 0"
                  textAlign="center"
                  fontSize="0.8rem"
                  ml={2}
                >
                  {labels[hover !== -1 ? hover : value]}
                </Box>
              )}
            </div>
          </Accordion>
          <Accordion title="Shipping">
            <div>
              <Radio
                color="primary"
                checked={shipping === "Yes"}
                value="Yes"
                onChange={handleShipping}
                name="shipping"
              />
              <label>Yes</label>
            </div>
            <div>
              <Radio
                color="primary"
                checked={shipping === "No"}
                value="No"
                onChange={handleShipping}
                name="shipping"
              />
              <label>No</label>
            </div>
          </Accordion>
          <Accordion title="Colors">
            <div>
              {colorsData.map((c, index) => {
                return (
                  <div key={index}>
                    <Radio
                      disableRipple={true}
                      color="primary"
                      value={c}
                      onChange={handleColor}
                      checked={color === c}
                    />
                    <label>{c}</label>
                  </div>
                );
              })}
            </div>
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
