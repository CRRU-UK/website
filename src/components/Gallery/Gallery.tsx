/* istanbul ignore file */

import { useState, useEffect, useRef, createRef } from "react";

import type { FlattenedImage } from "@/helpers/types";

import ImageCaption from "../ImageCaption/ImageCaption";

import styles from "./Gallery.module.scss";

interface Props {
  images: Array<FlattenedImage>;
}

const Gallery = ({ images }: Props) => {
  const [slideIndex, setSlideIndex] = useState<number>(0);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return undefined;
    }

    const cachedRef = scrollRef.current as HTMLDivElement;

    const scrollEvent = () => {
      const { scrollLeft, offsetWidth } = cachedRef;

      const scrollIndex = Math.floor(
        (scrollLeft + offsetWidth / 2) / offsetWidth,
      );
      setSlideIndex(scrollIndex);
    };

    cachedRef.addEventListener("scroll", scrollEvent);

    return () => cachedRef.removeEventListener("scroll", scrollEvent);
  }, [scrollRef]);

  const imagesRefs = images.map((item) => ({
    ...item,
    ref: createRef(),
  }));

  const scrollToSlide = (index: number) =>
    (imagesRefs[index].ref.current as HTMLDivElement).scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

  const handlePreviousSlide = () => {
    let newIndex = slideIndex - 1;
    if (newIndex < 0) {
      newIndex = imagesRefs.length - 1;
    }

    return scrollToSlide(newIndex);
  };

  const handleNextSlide = () => {
    let newIndex = slideIndex + 1;
    if (newIndex >= imagesRefs.length) {
      newIndex = 0;
    }

    return scrollToSlide(newIndex);
  };

  const imageElements = imagesRefs.map((item) => (
    <div
      key={item.url}
      className={styles.item}
      ref={item.ref as React.RefObject<HTMLDivElement>}
    >
      <ImageCaption
        src={item.url}
        width={1000}
        height={750}
        caption={item.alt ?? ""}
      />
    </div>
  ));

  const paginationElements = images.map((item, index) => {
    const classes = [styles["pagination-item"]];
    if (index === slideIndex) {
      classes.push(styles["pagination-item-active"]);
    }

    return (
      <button
        key={item.url}
        type="button"
        className={classes.join(" ")}
        onClick={() => scrollToSlide(index)}
        onKeyDown={() => {}}
        title={`Image ${index + 1}`}
        aria-label={`Image ${index + 1}`}
        tabIndex={0}
      />
    );
  });

  return (
    <div className={styles.gallery}>
      <div className={styles.pagination}>
        <button
          type="button"
          className={`${styles["pagination-arrow"]} ${styles["pagination-arrow-previous"]}`}
          onClick={handlePreviousSlide}
          onKeyDown={() => {}}
          title="Previous slide"
          aria-label="Previous slide"
          tabIndex={0}
        />

        {paginationElements}

        <button
          type="button"
          className={`${styles["pagination-arrow"]} ${styles["pagination-arrow-next"]}`}
          onClick={handleNextSlide}
          onKeyDown={() => {}}
          title="Previous slide"
          aria-label="Previous slide"
          tabIndex={0}
        />
      </div>

      <div className={styles.container} ref={scrollRef}>
        {imageElements}
      </div>
    </div>
  );
};

export default Gallery;
