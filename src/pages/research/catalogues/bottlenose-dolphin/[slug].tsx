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
import { Breadcrumbs, SEO, Catalogue } from '@/components/index';

import styles from './[slug].module.scss';

const Unknown = () => (
  <span
    title="Catalogue data is not currently available for this entry and may be updated in the future."
    className={styles.unknown}
  >
    <span>Unknown</span>
  </span>
);

interface PageProps {
  catalogueData: CatalogueBottlenoseDolphin,
}

const familyTree = (
  name: string,
  mother: CatalogueBottlenoseDolphin['mother'],
  calves: CatalogueBottlenoseDolphin['calves'],
) => {
  let motherElement = null;
  if (mother) {
    motherElement = (
      <li className={styles.mother}>
        <b><span>Mother</span></b>
        <Catalogue
          title={String(mother.id)}
          subtitle={mother?.name ? String(mother.name) : undefined}
          link={`/research/catalogues/bottlenose-dolphin/${mother.slug}`}
          image={mother?.image ?? undefined}
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
            calves.map((item) => (
              <li key={item.id}>
                <Catalogue
                  title={item.id}
                  subtitle={item?.name ?? undefined}
                  link={item.slug}
                  image={item?.image ?? undefined}
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

const Page: NextPage<PageProps> = ({
  catalogueData,
}: PageProps) => {
  const {
    id,
    name,
    slug,
    description,
    firstSeen,
    birthYear,
    age,
    sex,
    dorsalEdgeMarkings,
    otherFeatures,
    images,
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

  let imagesElement = <div className={styles['no-image']}>No images currently available</div>;
  if (catalogueData.entry?.images?.length > 0) {
    imagesElement = (
      <span className={styles['images-list']}>
        {images.map((item) => (
          <Image
            key={item.url}
            src={item.url}
            width={item.width}
            height={item.height}
            alt=""
            className={styles.image}
          />
        ))}
      </span>
    );
  }

  return (
    <>
      <SEO
        page={{
          title: `${title} - ${sitemap['catalogue-bottlenose-dolphin'].title}`,
          description: pageDescription,
          path,
        }}
        breadcrumbs={breadcrumbs}
        images={images?.map(({ url, width, height }) => ({ url, width, height })) ?? undefined}
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
              <li><b>CRRU ID #</b> {id}</li>
              <li><b>AU ID Ref #</b> <Unknown /></li>
              <li><b>Name</b> {name ?? <i>(None)</i>}</li>
              <li><b>First Seen</b> {firstSeen ? formatDateMonth(firstSeen) : <Unknown />}</li>
              <li><b>Birth Year</b> {birthYear ?? <Unknown />}</li>
              <li><b>Age (Years)</b> {age ? ageText : <Unknown />}</li>
              <li><b>Sex</b> {sex === 'Unknown' ? <Unknown /> : sex}</li>
              <li className={styles['info-item-double']}><b>Total Number Of Calves</b> 5</li>
              <li className={styles['info-item-full']}><b>Dorsal Edge Markings (DEMs)</b> {dorsalEdgeMarkings ?? 'None'}</li>
              <li className={styles['info-item-full']}><b>Other Features</b> {otherFeatures ?? 'None'}</li>
            </ul>

            {imagesElement}
          </section>

          <section className={styles.right}>
            {familyTree(title, catalogueData.mother, catalogueData.calves)}
          </section>
        </div>
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
