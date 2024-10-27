import type { NextPage, GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';

import Link from 'next/link';
import Image from 'next/image';

import type { CatalogueMinkeWhale } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import { Catalogues } from '@/helpers/constants';
import { formatDateMonth } from '@/helpers/formatDate';
import { getMinkeWhaleCatalogueItem, getMinkeWhaleItemEntrySlug } from '@/helpers/getCatalogue';

import {
  Breadcrumbs,
  SEO,
  Timeline,
  Tooltip,
  Toolbar,
} from '@/components';

import styles from '../[slug].module.scss';

const Unknown = () => (
  <span
    title="Catalogue data is not currently available for this entry and may be updated in the future."
    className={styles.unknown}
  >
    <span>Unknown</span>
  </span>
);

interface PageProps {
  catalogueData: CatalogueMinkeWhale,
}

const Page: NextPage<PageProps> = ({
  catalogueData,
}: PageProps) => {
  const {
    id,
    reference,
    name,
    slug,
    totalRecaptures,
    yearsRecaptured,
    leftDorsalFin,
    rightDorsalFin,
    lastUpdated,
  } = catalogueData.entry;

  const title = name ? `#${id} (${name})` : `#${id}`;
  const pageDescription = `CRRU Minke Whale catalogue entry for ${title}.`;
  const path = `/research/catalogues/${Catalogues.MinkeWhale}/${slug}`;
  const image = leftDorsalFin ?? rightDorsalFin;
  const breadcrumbs = [
    sitemap.research,
    { title: sitemap.catalogues.title, path: `${sitemap.catalogues.path}?catalogue=${Catalogues.MinkeWhale}` },
    { title: `Minke Whale: ${title}`, path },
  ];

  const noImage = <span className={styles['no-image']}>No image</span>;

  const router = useRouter();

  return (
    <>
      <SEO
        page={{
          title: `${title} - Minke Whale - ${sitemap.catalogues.title}`,
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

      {/* key is needed to reset search state on navigation */}
      <Toolbar catalogue={Catalogues.MinkeWhale} key={router.asPath} />

      <section className={styles.container}>
        <article className={styles.main}>
          <Breadcrumbs style="inline" items={breadcrumbs} />

          <div className={styles.wrapper}>
            <h2 className={styles['icon-whale']}>Minke Whale</h2>
            <h1>{title}</h1>

            <ul className={styles.info}>
              <li className={[styles['info-item-half'], styles['info-item-crru']].join(' ')}>
                <b>CRRU ID #</b>
                {id}
              </li>

              <li className={[styles['info-item-half'], styles['info-item-hwdt']].join(' ')}>
                <b>HWDT Ref # <Tooltip text="Hebridean Whale and Dolphin Trust catalogue reference" /></b>
                {reference ? <Link
                  href="https://hwdt.org/catalogue-minke-whale"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="external"
                >{reference}</Link> : "-"}
              </li>

              <li className={[styles['info-item-half'], styles['info-item-name']].join(' ')}>
                <b>Name</b>
                {name ?? <i className={styles.unknown}>Unnamed</i>}
              </li>

              <li className={[styles['info-item-half'], styles['info-item-total-recaptures']].join(' ')}>
                <b>No. of Recaptures</b>
                {totalRecaptures ?? <Unknown />}
              </li>

              <li className={[styles['info-item-full'], styles['info-item-years-recaptured']].join(' ')}>
                <b>Years Recaptured</b>
                {yearsRecaptured ? <Timeline items={yearsRecaptured} /> : <i className={styles.unknown}>N/A</i>}
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
            </ul>
          </div>
        </article>

        <article className={styles.sidebar}>
          <p className={styles['no-data']}>No family data available</p>
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

  const catalogueData = await getMinkeWhaleCatalogueItem(slug);

  if (!catalogueData) {
    const [id] = slug.split('-');

    const newSlug = await getMinkeWhaleItemEntrySlug(id);
    if (newSlug) {
      return {
        redirect: {
          permanent: true,
          destination: `/research/catalogues/${Catalogues.MinkeWhale}/${newSlug}`,
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
