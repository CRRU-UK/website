import Link from 'next/link';

import { Catalogues } from '@/helpers/constants';

import React from 'react';

import styles from './Card.module.scss';

interface Props {
  type: Catalogues,
  id: string,
  name?: string,
  reference?: string,
  link: string,
  disabled?: boolean,
}

const Card = ({
  type,
  id,
  reference,
  name,
  link,
  disabled = false,
}: Props) => {
  const classes = [styles.card, styles['no-image']];

  if (type === Catalogues.BottlenoseDolphin) {
    classes.push(styles.dolphin);
  }

  if (type === Catalogues.MinkeWhale) {
    classes.push(styles.whale);
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
          {reference && (<span className={styles.reference}>{reference}</span>)}
        </span>
        <span className={styles.name}>{name ?? <i>Unnamed</i>}</span>
      </span>
    </Link>
  );
}

export default Card;
