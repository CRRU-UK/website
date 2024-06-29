import type { NextPage, GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

import type { CatalogueBottlenoseDolphin } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import { formatDateMonth } from '@/helpers/formatDate';
import { getCatalogueItem, getCatalogueItemSlug } from '@/helpers/getBottlenoseDolphinCatalogue';

import Hero from '@/components/Hero/Hero';
import { Breadcrumbs, SEO, Catalogue, Tooltip } from '@/components/index';

import styles from './[slug].module.scss';

const Unknown = () => (
  <span
    title="Catalogue data is not currently available for this entry and may be updated in the future."
    className={styles.unknown}
  >
    <span>Unknown</span>
  </span>
);

interface FamilyTreeProps {
  name: string,
  data: CatalogueBottlenoseDolphin,
}

const familyTree = ({ name, data }: FamilyTreeProps) => {
  const {
    mother,
    calves,
  } = data;

  let motherElement = null;
  if (mother) {
    motherElement = (
      <li className={styles.mother}>
        <b><span>Mother</span></b>
        <Catalogue
          title={String(mother.id)}
          subtitle={mother?.name ? String(mother.name) : undefined}
          link={`/research/catalogues/bottlenose-dolphin/${mother.slug}`}
        />
      </li>
    );
  }

  let calvesElement = null;
  if (calves.length) {
    calvesElement = (
      <li className={styles.calves}>
        <b><span>Calves</span></b>
        <ul>
          {
            calves.map((item, index) => (
              <li key={item.id}>
                {index === 0 && (<span className={styles.current}>Current Calf</span>)}
                <Catalogue
                  title={item.id}
                  subtitle={item?.name ?? undefined}
                  link={item.slug}
                />
              </li>
            ))
          }
        </ul>
      </li>
    );
  }

  if (!motherElement && !calvesElement) {
    return null;
  }

  return (
    <ul className={styles.tree}>
      {motherElement}

      <li className={styles.name}>
        {name}
      </li>

      {calvesElement}
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
    description,
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
  const pageDescription = `CRRU Bottlenose dolphin catalogue entry for ${title}.`;
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

  const noImage = <div className={styles['no-image']}>No image</div>;
  const imagesElement = (
    <div className={styles['images-list']}>
      <div className={styles['images-list-left']}>
        <b>Left Dorsal Fin</b>
        {leftDorsalFin ? <Image
          src={leftDorsalFin.url}
          width={leftDorsalFin.width}
          height={leftDorsalFin.height}
          alt="Left Dorsal Fin"
          className={styles.image}
        /> : (noImage)}
      </div>

      <div className={styles['images-list-right']}>
        <b>Right Dorsal Fin</b>
        {rightDorsalFin ? <Image
          src={rightDorsalFin.url}
          width={rightDorsalFin.width}
          height={rightDorsalFin.height}
          alt="Right Dorsal Fin"
          className={styles.image}
        /> : (noImage)}
      </div>

      {otherImages.map((item) => (
        <Image
          key={item.url}
          src={item.url}
          width={item.width}
          height={item.height}
          alt=""
          className={styles.image}
        />
      ))}
    </div>
  )

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

      <Hero
        title={title}
        subtitle={sitemap['catalogue-bottlenose-dolphin'].title}
        plain={true}
        wide
      />

      <Breadcrumbs
        items={breadcrumbs}
        wide
      />

      <article className="content wide">
        <div className={styles.left}>
          <section>
            {description && (
              <div className={styles.description}>
                <ReactMarkdown>{description}</ReactMarkdown>
                <hr />
              </div>
            )}

            <ul className={styles.info}>
              <li>
                <b>CRRU ID #</b>
                {id}
              </li>
              <li>
                <b>
                  AULFS ID Ref # 
                  <Tooltip text="Aberdeen University Lighthouse Field Station" />
                </b>
                {auid ?? <Unknown />}
              </li>
              <li>
                <b>Name</b>
                {name ?? <i>(None)</i>}
              </li>
              <li>
                <b>First Seen</b>
                {firstSeen ? formatDateMonth(firstSeen) : <Unknown />}
              </li>
              <li>
                <b>Birth Year</b>
                {birthYear ?? <Unknown />}
              </li>
              <li>
                <b>Age (Years)</b>
                {age ? ageText : <Unknown />}
              </li>
              <li>
                <b>Sex</b>
                {sex === 'Unknown' ? <Unknown /> : sex}
              </li>
              <li className={styles['info-item-double']}>
                <b>
                  Total Number Of Calves
                  <Tooltip text="Total number of calves as identified by CRRU and AULFS" />
                </b>
                TBA
              </li>
            </ul>

            {imagesElement}
          </section>

          <section className={styles.right}>
            {familyTree({ name: title, data: catalogueData })}
          </section>
        </div>

        <p className={styles.updated}>Last updated: {formatDateMonth(lastUpdated)}</p>
      </article>
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
