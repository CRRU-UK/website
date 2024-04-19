import type { NextPage, GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import type { Asset } from 'contentful';
import type { Document } from '@contentful/rich-text-types';

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useContentfulInspectorMode, useContentfulLiveUpdates } from '@contentful/live-preview/react';

import type { PageData, ContentTypeSpeciesPage } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import pageRenderOptions from '@/helpers/rendering';
import { ContentTypes, LOCALE } from '@/helpers/constants';
import { contentfulDeliveryClient, contentfulPreviewClient } from '@/helpers/contentful';
import { flattenImageAssetFields } from '@/helpers/flattenAssetFields';

import Hero from '@/components/Hero/Hero';
import { Breadcrumbs, SEO } from '@/components/index';

import styles from './[slug].module.scss';

interface PageProps {
  id: string,
  name: string,
  description: string,
  slug: string,
  order: string,
  suborder: string,
  family: string,
  subfamily: string | null,
  genus: string,
  species: string,
  content: Document,
  image: PageData['image'],
}

const Page: NextPage<PageProps> = ({
  id,
  name,
  description,
  slug,
  order,
  suborder,
  family,
  subfamily,
  genus,
  species,
  content,
  image,
}) => {
  const wide = !!subfamily;
  const [speciesName, speciesYear] = species.split('(');

  const pageBreadcrumbs = [
    sitemap.education,
    sitemap['cetacean-fact-files'],
    { title: name, path: `/education/species/${slug}` },
  ];

  const previewProps = useContentfulInspectorMode();
  const previewData = useContentfulLiveUpdates({
    sys: { id },
    fields: {
      order: { [LOCALE]: order },
      suborder: { [LOCALE]: suborder },
      family: { [LOCALE]: family },
      subfamily: { [LOCALE]: subfamily },
      genus: { [LOCALE]: genus },
      species: { [LOCALE]: species },
      content: { [LOCALE]: content },
    },
  });

  return (
    <>
      <SEO
        page={{
          title: `${name} - ${sitemap['cetacean-fact-files'].title}`,
          description: String(description),
          path: `/education/species/${slug}`,
        }}
        images={image ? [{
          url: image.url,
          width: image.width,
          height: image.height,
        }] : undefined}
        breadcrumbs={pageBreadcrumbs}
      />

      <Hero
        title={name}
        subtitle={sitemap['cetacean-fact-files'].title}
        background={image?.url}
      />

      <Breadcrumbs
        items={pageBreadcrumbs}
      />

      <article className="content">
        <ul className={styles.taxonomy}>
          <li>
            <strong>Order:</strong>
            <span {...previewProps({ entryId: previewData.sys.id, fieldId: 'order' })}>
              {order}
            </span>
          </li>
          <li>
            <strong>Suborder:</strong>
            <span {...previewProps({ entryId: previewData.sys.id, fieldId: 'suborder' })}>
              {suborder}
            </span>
          </li>
          <li>
            <strong>Family:</strong>
            <span {...previewProps({ entryId: previewData.sys.id, fieldId: 'family' })}>
              {family}
            </span>
          </li>
          {subfamily && (
            <li>
              <strong>Subfamily:</strong>
              <span {...previewProps({ entryId: previewData.sys.id, fieldId: 'subfamily' })}>
                {subfamily}
              </span>
            </li>
          )}
          <li>
            <strong>Genus:</strong>
            <span {...previewProps({ entryId: previewData.sys.id, fieldId: 'genus' })}>
              {genus}
            </span>
          </li>
          <li className={!wide ? styles.wide : ''}>
            <strong>Species:</strong>
            <span {...previewProps({ entryId: previewData.sys.id, fieldId: 'species' })}>
              <em>{speciesName}</em> ({speciesYear}
            </span>
          </li>
        </ul>

        <span {...previewProps({ entryId: previewData.sys.id, fieldId: 'content' })}>
          {documentToReactComponents(content, pageRenderOptions)}
        </span>
      </article>
    </>
  );
};

interface PageParams extends ParsedUrlQuery {
  slug: string,
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const { slug } = ctx.params as PageParams;

  const client = ctx?.query?.preview ? contentfulPreviewClient : contentfulDeliveryClient;
  const { items } = await client.getEntries<ContentTypeSpeciesPage>({
    content_type: ContentTypes.SpeciesPage,
    'fields.slug': slug,
    limit: 1,
  });

  if (!items.length) {
    return { notFound: true };
  }

  const [{ sys, fields }] = items;

  return {
    props: {
      id: sys.id,
      name: fields.name,
      description: fields.description,
      slug: fields.slug,
      order: fields.order,
      suborder: fields.suborder,
      family: fields.family,
      subfamily: fields?.subfamily ?? null,
      genus: fields.genus,
      species: fields.species,
      content: fields.content,
      image: flattenImageAssetFields(fields.image as Asset),
    },
  };
};

export default Page;
