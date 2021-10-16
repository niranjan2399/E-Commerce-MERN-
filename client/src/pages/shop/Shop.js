import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { getByFilter, listProducts } from "../../utils/product";
import {
  Slider,
  Checkbox,
  Radio,
  FormControlLabel,
  CircularProgress,
} from "@material-ui/core";
import ProductCard from "../../components/productCard/ProductCard";
import WarningDiv from "../../components/warning/WarningDiv";
import Accordion from "../../components/accordion/Accordion";
import { getCategories } from "../../utils/category";
import { Rating } from "@material-ui/lab";
import "./shop.scss";
import { Close, FilterList } from "@material-ui/icons";

const Shop = () => {
  const [products, setProducts] = useState(null);
  const [price, setPrice] = useState([0, 0]);
  const [categories, setCategories] = useState(null);
  const [categoriesId, setCategoriesId] = useState([]);
  const [shipping, setShipping] = useState();
  const [color, setColor] = useState();
  const [value, setValue] = useState(0);
  const { search } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const { text } = search;
  const filters = useRef();
  const colorsData = ["Blue", "Red", "Green", "Black", "Silver"];

  useEffect(() => {
    if (text === "") {
      (async () => {
        const res = await listProducts(12);
        setProducts(res.data);
      })();
    }
  }, [text]);

  useEffect(() => {
    const filteredProducts = setTimeout(async () => {
      if (text !== "") {
        setCategoriesId([]);
        setPrice([0, 0]);
        setValue(0);
        setShipping();
        setColor();

        const res = await getByFilter({ query: text });
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

    const res = await getByFilter({ price });
    setProducts(res.data);
  };

  const handleCategory = async (e) => {
    let sendData = [];
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
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
    setPrice([0, 0]);
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
    setPrice([0, 0]);
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
    setPrice([0, 0]);
    setValue(0);
    setShipping();

    const res = await getByFilter({ color: e.target.value });
    setProducts(res.data);
    setColor(e.target.value);
  };

  const clearAll = () => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesId([]);
    setPrice([0, 0]);
    setValue(0);
    setShipping();
    setColor();

    (async () => {
      const res = await listProducts(12);
      setProducts(res.data);
    })();
  };

  const hideFilters = () => {
    filters.current.style = "";
  };

  const revealFilters = () => {
    filters.current.style.display = "flex";
  };

  return (
    <>
      <Navbar />
      <div className="right__top">
        <button className="option" onClick={revealFilters}>
          <FilterList style={{ marginRight: ".5rem" }} />
          Filters
        </button>
      </div>
      <div className="shop">
        <div className="shop__left" ref={filters}>
          <div className="shop__filterHead">
            Filter Products
            <button onClick={hideFilters}>
              <Close />
            </button>
          </div>
          <button onClick={clearAll}>Clear All</button>
          <Accordion title="Price">
            <div className="shop__filterSlider">
              <Slider
                min={0}
                max={300}
                value={price}
                onChange={(_, newValue) => setPrice(newValue)}
                onChangeCommitted={handlePrice}
                valueLabelDisplay="on"
                valueLabelFormat={(x) => `$${x}`}
              />
            </div>
          </Accordion>
          {categories && (
            <Accordion title="Category">
              <div className="shop__filterCategory">
                {categories.map((c, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      style={{
                        paddingInline: ".75rem",
                      }}
                      control={
                        <Checkbox
                          disableRipple={true}
                          color="primary"
                          value={c._id}
                          name={"ch" + index}
                          onChange={handleCategory}
                          size="small"
                          checked={categoriesId.includes(c._id)}
                        />
                      }
                      label={c.name}
                    />
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
              />
            </div>
          </Accordion>
          <Accordion title="Shipping">
            <div className="shop__filterShipping">
              <FormControlLabel
                style={{
                  paddingInline: ".75rem",
                }}
                control={
                  <Radio
                    color="primary"
                    checked={shipping === "Yes"}
                    value="Yes"
                    onChange={handleShipping}
                    name="shipping"
                    size="small"
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                style={{
                  paddingInline: ".75rem",
                }}
                control={
                  <Radio
                    color="primary"
                    checked={shipping === "No"}
                    value="No"
                    onChange={handleShipping}
                    name="shipping"
                    size="small"
                  />
                }
                label={"No"}
              />
            </div>
          </Accordion>
          <Accordion title="Colors">
            <div className="shop__filterColors">
              {colorsData.map((c, index) => {
                return (
                  <FormControlLabel
                    style={{
                      paddingInline: ".75rem",
                    }}
                    key={index}
                    control={
                      <Radio
                        disableRipple={true}
                        color="primary"
                        value={c}
                        onChange={handleColor}
                        checked={color === c}
                        size="small"
                      />
                    }
                    label={c}
                  />
                );
              })}
            </div>
          </Accordion>
        </div>
        <div className="shop__right">
          <div className="right__bottom">
            {products ? (
              products.length > 0 ? (
                products.map((product) => {
                  return <ProductCard product={product} key={product._id} />;
                })
              ) : (
                <div className="shop__warning">
                  <WarningDiv
                    message={
                      text !== ""
                        ? "Sorry, No Product Found Matching Your Search"
                        : "Sorry, No Products Found"
                    }
                  />
                </div>
              )
            ) : (
              <div>
                <CircularProgress
                  style={{
                    color: "#8167a9",
                    width: "2rem",
                    height: "2rem",
                    marginTop: "3rem",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
