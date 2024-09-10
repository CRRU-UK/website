import Link from 'next/link';

import React from 'react';

import styles from './Catalogue.module.scss';

interface Props {
  title: string,
  subtitle?: string,
  link: string,
  disabled?: boolean,
}

const Catalogue = ({
  title,
  subtitle,
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
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
    </Link>
  );
}

export default Catalogue;
