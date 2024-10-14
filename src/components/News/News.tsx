import Link from 'next/link';
import Image from 'next/image';

import { formatDateRelative } from '@/helpers/formatDate';

import styles from './News.module.scss';

interface Props {
  image: {
    src: string,
    width: number,
    height: number,
    alt: string,
  },
  link: string,
  title: string,
  date?: string,
  category?: string,
}

const News = ({
  link,
  image,
  title,
  date,
  category,
}: Props) => {
  let imageURL = image.src;
  if (imageURL.startsWith('//')) {
    imageURL = `https:${imageURL}`;
  }

  return (
    <article className={styles.news}>
      <Link
        href={link}
        className="news"
      >
        <div className={styles['image-container']}>
          <Image
            src={imageURL}
            alt=""
            width={image.width}
            height={image.height}
            quality={90}
          />
        </div>
        <h4>{title}</h4>
        <div className={styles.subtitles}>
          {date && <p className={styles.date} title={date}>{formatDateRelative(date)}</p>}
          {category && <p className={styles.category}>{category}</p>}
        </div>
      </Link>
    </article>
  );
};

export default News;
