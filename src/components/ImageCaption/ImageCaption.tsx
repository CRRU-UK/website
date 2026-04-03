/* istanbul ignore file */

import Image from "next/image";
import { useState } from "react";

import styles from "./ImageCaption.module.scss";

export interface ImageCaptionProps {
  alt?: string;
  caption?: string;
  height: number;
  src: string;
  width: number;
}

const Caption = (caption: string) => {
  const [open, setOpen] = useState<boolean>(false);

  const textClasses = [styles["caption-text"]];
  const buttonClasses = [styles["caption-button"]];
  if (open) {
    buttonClasses.push(styles["caption-button-active"]);
    textClasses.push(styles["caption-text-active"]);
  }

  return (
    <figcaption
      className={styles.caption}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-expanded={open}
        aria-label="Caption"
        className={buttonClasses.join(" ")}
        onKeyDown={() => {}}
        tabIndex={0}
        title="Caption"
        type="button"
      />
      <span className={textClasses.join(" ")}>{caption}</span>
    </figcaption>
  );
};

const ImageCaption = ({ src, width, height, caption, alt }: ImageCaptionProps) => (
  <figure className={styles.image}>
    {caption && Caption(caption)}
    <Image
      alt={alt ?? ""}
      height={height}
      src={src}
      style={{ maxWidth: width }}
      title={caption ?? ""}
      width={width}
    />
  </figure>
);

export default ImageCaption;
