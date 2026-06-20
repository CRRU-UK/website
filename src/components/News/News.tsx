import Image from "next/image";
import Link from "next/link";

import { formatDateRelative } from "@/helpers/formatDate";

import styles from "./News.module.scss";

interface Props {
  category?: string;
  date?: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  link: string;
  title: string;
}

const News = ({ link, image, title, date, category }: Props) => {
  let imageURL = image.src;
  if (imageURL.startsWith("//")) {
    imageURL = `https:${imageURL}`;
  }

  return (
    <article className={styles.news}>
      <Link className="news" href={link}>
        <div className={styles["image-container"]}>
          <Image alt="" height={image.height} quality={90} src={imageURL} width={image.width} />
        </div>
        <h4>{title}</h4>
        <div className={styles.subtitles}>
          {!!date && (
            <p className={styles.date} title={date}>
              {formatDateRelative(date)}
            </p>
          )}
          {!!category && <p className={styles.category}>{category}</p>}
        </div>
      </Link>
    </article>
  );
};

export default News;
