import Link from 'next/link';
import Image from 'next/image';

import React from 'react';

import type { FlattenedImage } from '@/helpers/types';

import styles from './Catalogue.module.scss';

interface Props {
  title: string,
  subtitle?: string,
  link: string,
  image?: FlattenedImage,
}

const Catalogue = ({
  title,
  subtitle,
  link,
  image,
}: Props) => {
  const cardClasses = [styles.card];
  if (!image) {
    cardClasses.push(styles['no-image']);
  }

  return (
    <Link href={link} className={cardClasses.join(' ')}>
      <span className={styles.text}>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        <span className={styles.title}>
          <span>{title}</span>
        </span>
      </span>
      {image && (
        <Image
          src={image.url}
          width={300}
          height={150}
          alt=""
          className={styles.image}
        />
      )}
    </Link>
  );
};

export default Catalogue;
