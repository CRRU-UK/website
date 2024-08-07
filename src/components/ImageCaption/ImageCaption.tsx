/* istanbul ignore file */

import { useState } from 'react';

import Image from 'next/image';

import styles from './ImageCaption.module.scss';

export interface ImageCaptionProps {
  src: string,
  width: number,
  height: number,
  caption?: string,
  alt?: string,
}

const Caption = (caption: string) => {
  const [open, setOpen] = useState<boolean>(false);

  const textClasses = [styles['caption-text']];
  const buttonClasses = [styles['caption-button']];
  if (open) {
    buttonClasses.push(styles['caption-button-active']);
    textClasses.push(styles['caption-text-active']);
  }

  return (
    <figcaption
      className={styles.caption}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={buttonClasses.join(' ')}
        onKeyDown={() => {}}
        title="Caption"
        aria-label="Caption"
        aria-expanded={open}
        tabIndex={0}
      />
      <span className={textClasses.join(' ')}>
        {caption}
      </span>
    </figcaption>
  );
};

const ImageCaption = ({
  src,
  width,
  height,
  caption,
  alt,
}: ImageCaptionProps) => (
  <figure className={styles.image}>
    {caption && Caption(caption)}
    <Image
      src={src}
      width={width}
      height={height}
      title={caption ?? ''}
      alt={alt ?? ''}
      style={{ maxWidth: width }}
    />
  </figure>
);

export default ImageCaption;
