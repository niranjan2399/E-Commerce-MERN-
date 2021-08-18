import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import "./imageCarousel.scss";

const ImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const previousSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  return (
    <section className="imageCarousel">
      <div className="imageCarousel__preview">
        {images.map((image, index) => {
          return (
            <img
              className={index === current ? "active" : "inactive"}
              src={image.url}
              alt=""
              onClick={(e) => setCurrent(index)}
            />
          );
        })}
      </div>
      <div className="imageCarousel__carousel">
        <div className="imageCarousel__icon" onClick={previousSlide}>
          <ChevronLeft className="icon" />
        </div>
        {images.map((image, index) => {
          return (
            <div
              className={
                index === current
                  ? "imageCarousel__imgContainer active"
                  : "imageCarousel__imgContainer"
              }
            >
              {index === current && <img src={image.url} alt="" />}
            </div>
          );
        })}
        <div className="imageCarousel__icon" onClick={nextSlide}>
          <ChevronRight className="icon" />
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
