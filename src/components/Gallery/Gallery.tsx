/* istanbul ignore file */

import { createRef, useEffect, useRef, useState } from "react";

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

      const scrollIndex = Math.floor((scrollLeft + offsetWidth / 2) / offsetWidth);
      setSlideIndex(scrollIndex);
    };

    cachedRef.addEventListener("scroll", scrollEvent);

    return () => cachedRef.removeEventListener("scroll", scrollEvent);
  }, []);

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
    <div className={styles.item} key={item.url} ref={item.ref as React.RefObject<HTMLDivElement>}>
      <ImageCaption caption={item.alt ?? ""} height={750} src={item.url} width={1000} />
    </div>
  ));

  const paginationElements = images.map((item, index) => {
    const classes = [styles["pagination-item"]];
    if (index === slideIndex) {
      classes.push(styles["pagination-item-active"]);
    }

    return (
      <button
        aria-label={`Image ${index + 1}`}
        className={classes.join(" ")}
        key={item.url}
        onClick={() => scrollToSlide(index)}
        onKeyDown={() => {}}
        tabIndex={0}
        title={`Image ${index + 1}`}
        type="button"
      />
    );
  });

  return (
    <div className={styles.gallery}>
      <div className={styles.pagination}>
        <button
          aria-label="Previous slide"
          className={`${styles["pagination-arrow"]} ${styles["pagination-arrow-previous"]}`}
          onClick={handlePreviousSlide}
          onKeyDown={() => {}}
          tabIndex={0}
          title="Previous slide"
          type="button"
        />

        {paginationElements}

        <button
          aria-label="Previous slide"
          className={`${styles["pagination-arrow"]} ${styles["pagination-arrow-next"]}`}
          onClick={handleNextSlide}
          onKeyDown={() => {}}
          tabIndex={0}
          title="Previous slide"
          type="button"
        />
      </div>

      <div className={styles.container} ref={scrollRef}>
        {imageElements}
      </div>
    </div>
  );
};

export default Gallery;
