/* eslint-disable react/require-default-props */

import Link from 'next/link';
import Image from 'next/image';

import type { FlattenedImage } from '@/helpers/types';

import styles from './ListItem.module.scss';

interface Props {
  title: string,
  description?: string,
  link?: string,
  image?: FlattenedImage,
  category?: {
    text: string,
    style?: number,
  },
}

const ListItem = ({
  title,
  description,
  link,
  image,
  category,
}: Props) => {
  const imageElement = image ? (
    <Image
      src={image.url}
      width={image.width}
      height={image.height}
      alt={`Image of ${title}.`}
      className={styles.image}
    />
  ) : null;

  const titleElement = (
    <p className={styles.title}>
      {link ? (<Link href={link} rel="noopener noreferrer" target="_blank" className="external">{title}</Link>) : title}
    </p>
  );

  const descriptionElement = description ? (
    <p className={styles.description}>{description}</p>
  ) : null;

  const categoryClass = category ? styles[`category-style-${category.style ?? 1}`] : null;

  const categoryElement = category ? (
    <p className={`${styles.category} ${categoryClass}`}>{category.text}</p>
  ) : null;

  return (
    <section className={styles.item} key={title}>
      {image && (
        <div className={styles.side}>
          {link ? (
            <Link href={link} rel="noopener noreferrer" target="_blank">{imageElement}</Link>
          ) : imageElement}
        </div>
      )}

      <div className={styles.main}>
        <div className={styles.header}>
          {titleElement}
          {categoryElement}
        </div>
        {descriptionElement}
      </div>
    </section>
  );
};

export default ListItem;
