import Image from "next/image";
import Link from "next/link";

import type { FlattenedImage } from "@/helpers/types";

import styles from "./ListItem.module.scss";

interface Props {
  category?: {
    text: string;
    style?: number;
  };
  description?: string;
  image?: FlattenedImage;
  link?: string;
  title: string;
}

const ListItem = ({ title, description, link, image, category }: Props) => {
  const imageElement = image ? (
    <Image
      alt={`Image of ${title}.`}
      className={styles.image}
      height={image.height}
      src={image.url}
      width={image.width}
    />
  ) : null;

  const titleElement = (
    <p className={styles.title}>
      {link ? (
        <Link className="external" href={link} rel="noopener noreferrer" target="_blank">
          {title}
        </Link>
      ) : (
        title
      )}
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
      {!!image && (
        <div className={styles.side}>
          {link ? (
            <Link href={link} rel="noopener noreferrer" target="_blank">
              {imageElement}
            </Link>
          ) : (
            imageElement
          )}
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
