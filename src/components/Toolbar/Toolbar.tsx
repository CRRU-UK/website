import styles from './Toolbar.module.scss';

import React, { useState, useEffect } from 'react';

import type { CatalogueTypes, CatalogueBottlenoseDolphinListAPIResponse } from '@/helpers/types';

import { Card, Loading } from '@/components';

interface Props {
  type: CatalogueTypes,
}

const Toolbar = ({
  type,
}: Props) => {
  const [search, setSearch] = useState<string>('');
  const [data, setData] = useState<null | CatalogueBottlenoseDolphinListAPIResponse>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (search === '') {
      setData(null);
      return;
    }

    const getData = async () => {
      setLoading(true);

      const response = await fetch(`/api/catalogues/${type}?search=${search}&page=1`);
      const result: CatalogueBottlenoseDolphinListAPIResponse = await response.json();
      setData(result);

      setLoading(false);
    };

    const timeout = setTimeout(getData, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleSearchChange = (value: string) => setSearch(value);

  const classes = [styles.search];
  if (loading || data) {
    classes.push(styles.active);
  }

  const showResults = loading || data;

  const noResultsElement = <li className={styles['no-results']}>No results</li>;

  const resultsElements = data?.meta?.totalItems === 0 ? noResultsElement : data?.items.map((item) => (
    <li key={item.id}>
      <Card
        type={type}
        id={`#${item.id}`}
        name={item?.name ? String(item.name) : undefined}
        subid={item?.auid ? `#${item.auid}` : undefined}
        link={`/research/catalogues/${type}/${item.slug}`}
      />
    </li>
  ));

  return (
    <section className={styles.toolbar}>
      <div className={classes.join(' ')}>
        <input
          type="search"
          placeholder="Search by name, ID, AUID, birth year..."
          onChange={({ target }) => handleSearchChange((target as HTMLInputElement).value)}
        />

        {showResults && (
          <ul className={styles.results}>
            {loading ? <li className={styles['loading']}><Loading /></li> : resultsElements}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Toolbar;
