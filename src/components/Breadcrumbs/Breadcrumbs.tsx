/* eslint-disable react/require-default-props */

import Link from 'next/link';

import type { SitemapItem } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import styles from './Breadcrumbs.module.scss';

interface Props {
  items: Array<SitemapItem>,
  wide?: boolean,
}

const Breadcrumbs = ({
  items,
  wide = false,
}: Props) => {
  const links = items.map(({ title, path }, index) => {
    const last = index === items.length - 1;

    let item = (
      <span>{title}</span>
    );

    if (!last) {
      item = (
        <Link href={path}>{title}</Link>
      );
    }

    return (
      <li key={path}>
        {item}
      </li>
    );
  });

  return (
    <div className={styles['breadcrumbs-container']}>
      <ul className={`${styles.breadcrumbs} ${wide ? styles.wide : ''}`}>
        <li>
          <Link href={sitemap.home.path}>
            {sitemap.home.title}
          </Link>
        </li>
        {links}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
