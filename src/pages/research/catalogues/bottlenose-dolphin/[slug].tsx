import type { NextPage, GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import type { CatalogueBottlenoseDolphinListAPIResponse, CatalogueBottlenoseDolphin } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import { formatDateMonth } from '@/helpers/formatDate';
import { getCatalogueItem, getCatalogueItemSlug } from '@/helpers/getBottlenoseDolphinCatalogue';

import {
  SEO,
  Breadcrumbs,
  Catalogue,
  Tooltip,
  Loading,
} from '@/components/index';

import styles from './[slug].module.scss';

const Search = () => {
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

      const response = await fetch(`/api/catalogues/bottlenose-dolphin?search=${search}&page=1`);
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
      <Catalogue
        id={`#${item.id}`}
        name={item?.name ? String(item.name) : undefined}
        subid={item?.auid ? `#${item.auid}` : undefined}
        link={`/research/catalogues/bottlenose-dolphin/${item.slug}`}
      />
    </li>
  ));

  return (
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
  );
}

const Unknown = () => (
  <span
    title="Catalogue data is not currently available for this entry and may be updated in the future."
    className={styles.unknown}
  >
    <span>Unknown</span>
  </span>
);

const familyTree = (data: CatalogueBottlenoseDolphin) => {
  const {
    entry,
    mother,
    calves,
  } = data;

  const emptyElement = (<span className={styles.empty}>Unknown</span>)

  let motherElement = emptyElement;
  if (mother) {
    motherElement = (
      <Catalogue
        id={`#${mother.id}`}
        name={mother?.name ? String(mother.name) : undefined}
        subid={mother?.auid ? `#${mother.auid}` : undefined}
        link={`/research/catalogues/bottlenose-dolphin/${mother.slug}`}
      />
    );
  }

  let calvesElement = emptyElement;
  if (calves.length) {
    calvesElement = (
      <ul>
        {
          calves.map((item, index) => (
            <li key={item.id}>
              {index === 0 && (<span className={styles.current}>Current Calf</span>)}
              <Catalogue
                id={`#${item.id}`}
                subid={item?.auid ? `#${item.auid}` : undefined}
                name={item?.name ?? undefined}
                link={item.slug}
              />
            </li>
          ))
        }
      </ul>
    );
  }

  return (
    <ul className={styles.tree}>
      <li className={styles.mother}>
        <b><span>Mother</span></b>
        {motherElement}
      </li>

      <li className={styles.name}>
        <Catalogue
          id={`#${entry.id}`}
          subid={entry?.auid ? `#${entry.auid}` : undefined}
          name={entry.name ?? undefined}
          link={''}
          disabled
        />
      </li>

      <li className={styles.calves}>
        <b><span>Calves</span></b>
        {calvesElement}
      </li>
    </ul>
  ); 
};

interface PageProps {
  catalogueData: CatalogueBottlenoseDolphin,
}

const Page: NextPage<PageProps> = ({
  catalogueData,
}: PageProps) => {
  const {
    id,
    auid,
    name,
    slug,
    birthYear,
    sex,
    totalCalves,
    leftDorsalFin,
    rightDorsalFin,
    otherImages,
    lastUpdated,
  } = catalogueData.entry;

  const title = name ? `#${id} (${name})` : `#${id}`;
  const pageDescription = `CRRU Bottlenose Dolphin catalogue entry for ${title}.`;
  const path = `/research/catalogues/bottlenose-dolphin/${slug}`;
  const image = leftDorsalFin ?? rightDorsalFin ?? otherImages?.[0];
  const breadcrumbs = [
    sitemap.research,
    sitemap.catalogues,
    { title: `Bottlenose Dolphin: ${title}`, path },
  ];

  let ageNumber = null;
  if (birthYear !== null && !Number.isNaN(birthYear)) {
    ageNumber = new Date().getFullYear() - new Date(birthYear).getFullYear();
  }

  let ageText = null;

  if (ageNumber !== null) {
    ageText = ageNumber;

    if (ageNumber < 1) {
      ageText = '< 1';
    } else if (ageNumber > 25) {
      ageText = '25+';
    }
  }

  const noImage = <span className={styles['no-image']}>No image</span>;

  const router = useRouter();

  return (
    <>
      <SEO
        page={{
          title: `${title} - ${sitemap.catalogues.title}`,
          description: pageDescription,
          path,
        }}
        breadcrumbs={breadcrumbs}
        images={image ? [{
          url: image.url,
          width: image.width,
          height: image.height,
        }] : undefined}
      />

      <section className={styles.toolbar}>
        {/* key is needed to reset search state on navigation */}
        <Search key={router.asPath} />
      </section>

      <section className={styles.container}>
        <article className={styles.main}>
          <Breadcrumbs style="inline" items={breadcrumbs} />

          <div className={styles.wrapper}>
            <h1>{title}</h1>

            <ul className={styles.info}>
              <li className={styles['info-item-crru']}>
                <b>CRRU ID #</b>
                {id}
              </li>

              <li className={styles['info-item-au']}>
                <b>AULFS Ref # <Tooltip text="Aberdeen University Lighthouse Field Station" /></b>
                {auid ?? <Unknown />}
              </li>

              <li className={styles['info-item-name']}>
                <b>Name</b>
                {name ?? <i className={styles.unknown}>Unnamed</i>}
              </li>

              <li className={styles['info-item-birth-year']}>
                <b>Birth Year</b>
                {birthYear ?? <Unknown />}
              </li>

              <li className={styles['info-item-age']}>
                <b>Age (Years)</b>
                {ageText ? ageText : <Unknown />}
              </li>

              <li className={styles['info-item-sex']}>
                <b>Sex</b>
                {sex === 'Unknown' ? <Unknown /> : sex}
              </li>

              <li className={[styles['info-item-full'], styles['info-item-calves']].join(' ')}>
                <b>Total No. Of Known Calves</b>
                {sex !== 'Female' ? <i className={styles.unknown}>N/A</i> : (totalCalves ?? <Unknown />)}
              </li>

              <li className={[styles['info-item-half'], styles['info-item-dorsal-fin-left']].join(' ')}>
                <b>Left Dorsal Fin</b>
                {leftDorsalFin ? <Image
                  src={leftDorsalFin.url}
                  width={leftDorsalFin.width}
                  height={leftDorsalFin.height}
                  alt="Left Dorsal Fin"
                  className={styles.image}
                /> : (noImage)}
              </li>

              <li className={[styles['info-item-half'], styles['info-item-dorsal-fin-right']].join(' ')}>
                <b>Right Dorsal Fin</b>
                {rightDorsalFin ? <Image
                  src={rightDorsalFin.url}
                  width={rightDorsalFin.width}
                  height={rightDorsalFin.height}
                  alt="Left Dorsal Fin"
                  className={styles.image}
                /> : (noImage)}
              </li>

              {otherImages.length > 0 && (
                <li className={[styles['info-item-full'], styles['info-item-other-images']].join(' ')}>
                  <b>Other Images</b>

                  <ul>
                    {otherImages.map((item) => (
                      <li key={item.url}>
                        <Image
                          src={item.url}
                          width={item.width}
                          height={item.height}
                          alt=""
                          className={styles.image}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </article>

        <article className={styles.sidebar}>
          {familyTree(catalogueData)}
        </article>
      </section>

      <p className={styles['last-updated']}>Last updated: {formatDateMonth(lastUpdated)}</p>
    </>
  );
};

interface PageParams extends ParsedUrlQuery {
  slug: string,
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const { slug } = ctx.params as PageParams;

  const catalogueData = await getCatalogueItem(slug);

  if (!catalogueData) {
    const [id] = slug.split('-');

    const newSlug = await getCatalogueItemSlug(id);
    if (newSlug) {
      return {
        redirect: {
          permanent: true,
          destination: `/research/catalogues/bottlenose-dolphin/${newSlug}`,
        },
      };
    }

    return { notFound: true };
  }

  return {
    props: {
      catalogueData,
    },
  };
};

export default Page;
