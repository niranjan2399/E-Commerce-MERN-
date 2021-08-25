import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../productCard/ProductCard";

const HomePageScrollSection = ({ products, title }) => {
  const card = useRef();
  const section = useRef();
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const sect = section.current;
    const scrollFunction = () => {
      setScrolled(section.current.scrollLeft);
    };

    section.current &&
      section.current.addEventListener("scroll", scrollFunction);

    return () => {
      sect.removeEventListener("scroll", scrollFunction);
    };
  }, [section]);

  const scrollLeft = () => {
    const maxFullCards =
      Math.floor(
        section.current.offsetWidth / (card.current.offsetWidth + 16)
      ) * 232;

    if (scrolled > maxFullCards) {
      section.current.scroll({
        top: 0,
        left: scrolled - maxFullCards,
        behavior: "smooth",
      });
    } else {
      section.current.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const maxFullCards =
      Math.floor(
        section.current.offsetWidth / (card.current.offsetWidth + 16)
      ) * 232;
    if (
      section.current.scrollWidth - scrolled - section.current.offsetWidth >
      maxFullCards
    ) {
      section.current.scroll({
        top: 0,
        left: maxFullCards,
        behavior: "smooth",
      });
    } else {
      section.current.scroll({
        top: 0,
        left: section.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="homeContainer__section">
      <div className="homeContainer__sectionTop">{title}</div>
      <div className="homeContainer__sectionBottom" ref={section}>
        <div
          className="homeContainer__scrollButtons"
          data-section="newProduct"
          onClick={scrollLeft}
        >
          <NavigateBefore className="icons" />
        </div>
        <div className="homeContainer__sectionWrapper">
          {products.map((product) => {
            return (
              <ProductCard
                refCard={card}
                product={product}
                key={product.slug}
              />
            );
          })}
          {products.map((product) => {
            return <ProductCard product={product} key={product.slug} />;
          })}
          {products.map((product) => {
            return <ProductCard product={product} key={product.slug} />;
          })}
        </div>
        <div
          className="homeContainer__scrollButtons"
          data-section="bestProduct"
          onClick={scrollRight}
        >
          <NavigateNext className="icons" />
        </div>
      </div>
    </section>
  );
};

export default HomePageScrollSection;
