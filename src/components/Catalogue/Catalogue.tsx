import Link from 'next/link';

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
}: Props) => (
  <Link href={link} className={[styles.card, styles['no-image']].join(' ')}>
    <span className={styles.text}>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      <span className={styles.title}>
        <span>{title}</span>
      </span>
    </span>
  </Link>
);

export default Catalogue;
