import ImageCaption, { type ImageCaptionProps } from "../ImageCaption/ImageCaption";

import styles from "./ImageRow.module.scss";

interface Props {
  items: Array<ImageCaptionProps>;
}

const ImageRow = ({ items }: Props) => {
  const images = items.map(({ src, width, height, caption }) => (
    <ImageCaption caption={caption} height={height} key={src} src={src} width={width} />
  ));

  return <div className={styles["image-row"]}>{images}</div>;
};

export default ImageRow;
