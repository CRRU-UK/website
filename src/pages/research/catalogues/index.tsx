/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextPage, GetServerSideProps } from 'next';

import React, { useState, useEffect } from 'react';

import type { PageData, CatalogueBottlenoseDolphinListAPIResponse } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import getPageContent from '@/helpers/getPageContent';

import CommonPage from '@/layout/CommonPage';

import { Card, Filters, Loading } from '@/components';

import styles from './index.module.scss';

interface PageProps {
  pageData: PageData,
}

const Page: NextPage<PageProps> = ({
  pageData,
}: PageProps) => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [searchText, setSearchText] = useState<typeof search>('');
  const [data, setData] = useState<null | CatalogueBottlenoseDolphinListAPIResponse>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const query = [`page=${page}`];
      if (search !== '') {
        query.push(`search=${search}`);
      }

      const response = await fetch(`/api/catalogues/bottlenose-dolphin?${query.join('&')}`);
      const result: CatalogueBottlenoseDolphinListAPIResponse = await response.json();
      setSearchText(search);
      setData(result);

      setLoading(false);
    };

    const timeout = setTimeout(getData, 500);
    return () => clearTimeout(timeout);
  }, [page, search]);

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  let pageElements = null;
  if (data && data.meta.totalPages > 1) {
    pageElements = [];
    for (let i = 0; i < data.meta.totalPages; i += 1) {
      pageElements.push(
        <li
          key={i}
          className={(i + 1) === page ? styles['current-page'] : undefined}
        >
          <button
            type="button"
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        </li>,
      );
    }
  }

  let infoText = '';
  if (searchText !== '' && data?.items?.length === 0) {
    infoText = `No results for "${searchText}"`;
  } else if (searchText !== '' && data?.items) {
    infoText = `${data.meta.totalItems} ${data?.items.length > 1 ? 'items' : 'item'} found for "${searchText}" (page ${page} of ${data.meta.totalPages})`;
  } else if (data?.items) {
    infoText = `Page ${page} of ${data.meta.totalPages} (showing ${data.items.length} of ${data.meta.totalItems} items)`;
  }

  return (
    <CommonPage
      page={sitemap.catalogues}
      parent={sitemap.research}
      breadcrumbs={[sitemap.research, sitemap.catalogues]}
      data={pageData}
    >
      <br />

      <Filters
        onSearch={handleSearchChange}
        dropdowns={[{
          name: 'Catalogues',
          options: [{ text: 'Bottlenose dolphins', value: 'bottlenose-dolphin' }],
          callback: () => {},
        }]}
        searchLabel="Search by name, ID, AUID, birth year..."
      />

      <div className={loading ? styles.loading : ''}>
        {loading && <Loading />}

        {(!loading && infoText !== '') && <p className={styles.info}>{infoText}</p>}

        {(!loading && data?.items) && (
          <ul className={styles.list}>
            {
              data.items.map((item: any) => (
                <li key={item.id}>
                  <Card
                    id={item.id}
                    name={item.name ?? undefined}
                    subid={item?.auid ? `#${item.auid}` : undefined}
                    link={`/research/catalogues/bottlenose-dolphin/${item.slug}`}
                  />
                </li>
              ))
            }
          </ul>
        )}

        <ul className={styles.pagination}>
          {!loading && pageElements}
        </ul>
      </div>
    </CommonPage>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === 'true';
  const pageData = await getPageContent(
    sitemap.catalogues.path,
    { preview },
  );

  return {
    props: {
      preview,
      pageData,
    },
  };
};

export default Page;
