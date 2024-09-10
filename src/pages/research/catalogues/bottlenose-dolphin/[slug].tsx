import type { NextPage, GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import React from 'react';
import Image from 'next/image';

import type { CatalogueBottlenoseDolphin } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import { formatDateMonth } from '@/helpers/formatDate';
import { getCatalogueItem, getCatalogueItemSlug } from '@/helpers/getBottlenoseDolphinCatalogue';

import { SEO, Catalogue } from '@/components/index';

import styles from './[slug].module.scss';

const Unknown = () => (
  <span
    title="Catalogue data is not currently available for this entry and may be updated in the future."
    className={styles.unknown}
  >
    <span>UNKNOWN</span>
  </span>
);

const familyTree = (data: CatalogueBottlenoseDolphin) => {
  const {
    entry,
    mother,
    calves,
  } = data;

  const unknownElement = (<span className={styles.foobar}>Unknown</span>)

  let motherElement = unknownElement;
  if (mother) {
    motherElement = (
      <Catalogue
        title={`#${mother.id}`}
        subtitle={mother?.name ? String(mother.name) : undefined}
        link={`/research/catalogues/bottlenose-dolphin/${mother.slug}`}
      />
    );
  }

  let calvesElement = unknownElement;
  if (calves.length) {
    calvesElement = (
      <ul>
        {
          calves.map((item, index) => (
            <li key={item.id}>
              {index === 0 && (<span className={styles.current}>Current Calf</span>)}
              <Catalogue
                title={`#${item.id}`}
                subtitle={item?.name ?? undefined}
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
          title={`#${entry.id}`}
          subtitle={entry.name ?? undefined}
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
    firstSeen,
    birthYear,
    age,
    sex,
    leftDorsalFin,
    rightDorsalFin,
    otherImages,
    lastUpdated,
  } = catalogueData.entry;

  const title = name ? `#${id} (${name})` : `#${id}`;
  const pageDescription = `CRRU Bottlenose Dolphin catalogue entry for ${title}.`;
  const path = `/research/catalogues/bottlenose-dolphin/${slug}`;
  const breadcrumbs = [sitemap.research, sitemap['catalogue-bottlenose-dolphin'], { title, path }];

  let ageText = null;
  if (age && age > 25) {
    ageText = '25+';
  } else if (age && age > 1) {
    ageText = `${age}`;
  } else if (age) {
    ageText = `${age}`;
  }

  const noImage = <span className={styles['no-image']}>No image</span>;

  return (
    <>
      <SEO
        page={{
          title: `${title} - ${sitemap['catalogue-bottlenose-dolphin'].title}`,
          description: pageDescription,
          path,
        }}
        breadcrumbs={breadcrumbs}
      />

      <section className={styles.toolbar}>
        <input
          type="search"
          placeholder="Search by name, ID, AUID..."
          className={styles.search}
        />
      </section>

      <section className={styles.container}>
        <article className={styles.main}>
          <h1>{title}</h1>

          <ul className={styles.info}>
            <li className={styles['info-item-crru']}>
              <b>CRRU ID #</b>
              <span>{id}</span>
            </li>
            <li className={styles['info-item-au']}>
              <b>AULFS ID Ref #</b>
              <span>{auid ?? <Unknown />}</span>
            </li>
            <li className={styles['info-item-name']}>
              <b>Name</b>
              <span>{name ?? <i>(None)</i>}</span>
            </li>
            <li className={styles['info-item-first-seen']}>
              <b>First Seen</b>
              <span>{firstSeen ? formatDateMonth(firstSeen).toUpperCase() : <Unknown />}</span>
            </li>
            <li className={styles['info-item-birth-year']}>
              <b>Birth Year</b>
              <span>{birthYear ?? <Unknown />}</span>
            </li>
            <li className={styles['info-item-age']}>
              <b>Age (Years)</b>
              <span>{age ? ageText : <Unknown />}</span>
            </li>
            <li className={styles['info-item-sex']}>
              <b>Sex</b>
              <span>{sex === 'UNKNOWN' ? <Unknown /> : sex}</span>
            </li>
            <li className={[styles['info-item-wide'], styles['info-item-calves']].join(' ')}>
              <b>Total Number Of Calves</b>
              <Unknown />
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

          <p className={styles['last-updated']}>Last updated: {formatDateMonth(lastUpdated)}</p>
        </article>

        <div className={styles.sidebar}>
          {familyTree(catalogueData)}
        </div>
      </section>
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
