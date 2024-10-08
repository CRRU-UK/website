import Link from 'next/link';

import React from 'react';

import styles from './Catalogue.module.scss';

interface Props {
  id: string,
  name?: string,
  subid?: string,
  link: string,
  disabled?: boolean,
}

const Catalogue = ({
  id,
  subid,
  name,
  link,
  disabled = false,
}: Props) => {
  const classes = [styles.catalogue, styles['no-image']];

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

export default Catalogue;
