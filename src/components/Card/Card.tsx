import Link from 'next/link';

import type { CatalogueTypes } from '@/helpers/types';

import React from 'react';

import styles from './Card.module.scss';

interface Props {
  type: CatalogueTypes,
  id: string,
  name?: string,
  subid?: string,
  link: string,
  disabled?: boolean,
}

const Card = ({
  type,
  id,
  subid,
  name,
  link,
  disabled = false,
}: Props) => {
  const classes = [styles.card, styles['no-image']];

  if (type === 'bottlenose-dolphin') {
    classes.push(styles.dolphin);
  }

  if (disabled) {
    classes.push(styles.disabled);
  }

  return (
    <Link href={link} className={classes.join(' ')}>
      <span className={styles.icon}></span>
      <span className={styles.text}>
        <span className={styles.id}>
          <b>{id}</b>
          {subid && (<span className={styles.subid}>{subid}</span>)}
        </span>
        <span className={styles.name}>{name ?? <i>Unnamed</i>}</span>
      </span>
    </Link>
  );
}

export default Card;
