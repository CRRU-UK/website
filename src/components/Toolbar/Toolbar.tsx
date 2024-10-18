import styles from './Toolbar.module.scss';

import React, { useState, useEffect } from 'react';

import type { CatalogueAPIResponse } from '@/helpers/types';

import { Catalogues } from '@/helpers/constants';

import { Card, Loading } from '@/components';

interface Props {
  catalogue: Catalogues,
}

const Toolbar = ({
  catalogue,
}: Props) => {
  const [search, setSearch] = useState<string>('');
  const [data, setData] = useState<null | CatalogueAPIResponse>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (search === '') {
      setData(null);
      return;
    }

    const getData = async () => {
      setLoading(true);

      const response = await fetch(`/api/catalogues/${catalogue}?search=${search}&page=1`);
      const result: CatalogueAPIResponse = await response.json();
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
        type={catalogue}
        id={`#${item.id}`}
        name={item?.name ? String(item.name) : undefined}
        reference={item?.reference ? `#${item.reference}` : undefined}
        link={`/research/catalogues/${catalogue}/${item.slug}`}
      />
    </li>
  ));

  return (
    <section className={styles.toolbar}>
      <div className={classes.join(' ')}>
        <input
          type="search"
          placeholder="Search by name, ID, reference, birth year..."
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
