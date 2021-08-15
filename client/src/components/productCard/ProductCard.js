import React from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { removeProduct } from "../../utils/product";
import { useSelector } from "react-redux";
import "./productCard.scss";

function ProductCard({ product, setProducts }) {
  const path = useHistory().location.pathname;
  const { user } = useSelector((state) => ({ ...state }));

  const deleteProduct = async (e) => {
    try {
      await removeProduct(e.target.dataset.slug, user.token);
      setProducts((prod) => {
        return prod.filter((p) => p.slug !== e.target.dataset.slug);
      });
      toast.success("Product Successfully Deleted");
    } catch (err) {
      toast.error("Unable To Delete Product");
    }
  };

  return (
    <div className="product">
      {/* <div className="product__infoLarge">
        <h4>FLUTED HEM DRESS</h4>
        <div className="sku">
          PRODUCT SKU: <strong>89356</strong>
        </div>

        <div className="price-big"> $39</div>

        <h3>COLORS</h3>
        <div className="colors-large">
          <ul>
            <li>
              <a href="/admin/products" style={{ background: "#222" }}>
                <span></span>
              </a>
            </li>
            <li>
              <a href="/admin/products" style={{ background: "#6e8cd5" }}>
                <span></span>
              </a>
            </li>
            <li>
              <a href="/admin/products" style={{ background: "#f56060" }}>
                <span></span>
              </a>
            </li>
            <li>
              <a href="/admin/products" style={{ background: "#44c28d" }}>
                <span></span>
              </a>
            </li>
          </ul>
        </div>

        <h3>SIZE</h3>
        <div className="sizes-large">
          <span>XS</span>
          <span>S</span>
          <span>M</span>
          <span>L</span>
          <span>XL</span>
          <span>XXL</span>
        </div>

        <button className="add-cart-large">Add To Cart</button>
      </div> */}

      <div className="product__make3D">
        <div className="product__front">
          <div className="product__shadow"></div>
          <img src={product.images[0].url} alt="" />
          <div className="product__overlay"></div>
          {path !== "/admin/products" && (
            <>
              <button className="product__button">Add to cart</button>
              <button className="product__button">View gallery</button>
            </>
          )}
          {/* <div className="stats"> */}
          <div className="product__statsContainer">
            {path !== "/admin/products" && (
              <span className="product_price">$39</span>
            )}
            <span className="product_name">{product.title}</span>
            <p>{product.description}</p>

            <div className="product-options">
              {path !== "/admin/products" ? (
                <>
                  <strong>SIZES</strong>
                  <span>XS, S, M, L, XL, XXL</span>
                  <strong>COLORS</strong>
                  <div className="colors">
                    <div className="c-blue">
                      <span></span>
                    </div>
                    <div className="c-red">
                      <span></span>
                    </div>
                    <div className="c-white">
                      <span></span>
                    </div>
                    <div className="c-green">
                      <span></span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="product__adminOptions">
                  <Link to="products/new" className="product__newLink">
                    <span>Update</span>
                  </Link>
                  <button
                    className="product__button"
                    data-slug={product.slug}
                    onClick={deleteProduct}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* </div> */}
        </div>

        <div className="product__back">
          <div className="shadow"></div>
          <div className="carousel">
            <ul className="carousel-container">
              <li>
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1.jpg"
                  alt=""
                />
              </li>
              <li>
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2.jpg"
                  alt=""
                />
              </li>
              <li>
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/3.jpg"
                  alt=""
                />
              </li>
            </ul>
            <div className="arrows-perspective">
              <div className="carouselPrev">
                <div className="y"></div>
                <div className="x"></div>
              </div>
              <div className="carouselNext">
                <div className="y"></div>
                <div className="x"></div>
              </div>
            </div>
          </div>
          <div className="flip-back">
            <div className="cy"></div>
            <div className="cx"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
