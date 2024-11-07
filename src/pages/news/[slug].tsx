import type { NextPage, GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import type { Asset } from 'contentful';

import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useContentfulInspectorMode, useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { NewsArticleJsonLd } from 'next-seo';

import type { NewsArticle, ContentTypeNews } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import {
  ContentTypes,
  DEFAULT_SITE_NAME,
  DEFAULT_SITE_DOMAIN,
  LOCALE,
} from '@/helpers/constants';
import pageRenderOptions from '@/helpers/rendering';
import { contentfulDeliveryClient, contentfulPreviewClient } from '@/helpers/contentful';
import { flattenImageAssetFields } from '@/helpers/flattenAssetFields';
import { formatDateRelative } from '@/helpers/formatDate';

import Hero from '@/components/Hero/Hero';
import { Breadcrumbs, SEO } from '@/components';

interface PageProps extends NewsArticle {
  id: string,
}

const Page: NextPage<PageProps> = ({
  id,
  title,
  slug,
  date,
  category,
  keywords,
  content,
  description,
  image,
}) => {
  const pageTitle = title;
  const pageBody = documentToReactComponents(content, pageRenderOptions);
  const pagePath = `/news/${slug}`;
  const pageBreadcrumbs = [
    sitemap.news,
    { title: pageTitle, description, path: pagePath },
  ];

  const previewProps = useContentfulInspectorMode();
  const previewData = useContentfulLiveUpdates({
    sys: { id },
    fields: { content: { [LOCALE]: content } },
  });

  const formattedDate = new Date(date).toISOString();

  return (
    <>
      <SEO
        page={{
          title: `${pageTitle} - ${sitemap.news.title}`,
          description,
          path: pagePath,
        }}
        images={[{
          url: image.url,
          width: image.width,
          height: image.height,
        }]}
        breadcrumbs={pageBreadcrumbs}
      />

      <NewsArticleJsonLd
        url={`${DEFAULT_SITE_DOMAIN}${pagePath}`}
        title={pageTitle}
        images={[image.url]}
        section={category}
        keywords={keywords.join(',')}
        dateCreated={formattedDate}
        datePublished={formattedDate}
        dateModified={formattedDate}
        authorName={[{ name: DEFAULT_SITE_NAME, url: DEFAULT_SITE_DOMAIN }]}
        publisherName={DEFAULT_SITE_NAME}
        publisherLogo={`${DEFAULT_SITE_DOMAIN}/images/logo.png`}
        description={description}
        body={documentToPlainTextString(content)}
      />

      <Hero
        title={pageTitle}
        subtitle={sitemap.news.title}
        plain
      />

      <Breadcrumbs
        items={pageBreadcrumbs}
      />

      <ul className="details">
        <li
          className="date"
          title={date}
          {...previewProps({ entryId: previewData.sys.id, fieldId: 'date' })}
        >
          {formatDateRelative(date)}
        </li>
        <li
          className="category"
          {...previewProps({ entryId: previewData.sys.id, fieldId: 'category' })}
        >
          {category}
        </li>
      </ul>

      <article
        className="content"
        {...previewProps({ entryId: previewData.sys.id, fieldId: 'content' })}
      >
        {pageBody}
      </article>
    </>
  );
};

interface PageParams extends ParsedUrlQuery {
  slug: string,
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === 'true';
  const { slug } = ctx.params as PageParams;

  const client = preview ? contentfulPreviewClient : contentfulDeliveryClient;
  const { items } = await client.getEntries<ContentTypeNews>({
    content_type: ContentTypes.NewsArticle,
    'fields.slug': slug,
    limit: 1,
  });

  if (!items.length) {
    return {
      notFound: true,
    };
  }

  const [{ sys, fields }] = items;

  return {
    props: {
      preview,
      id: sys.id,
      title: fields.title,
      slug: fields.slug,
      date: fields.date,
      category: fields.category,
      keywords: fields.keywords || [],
      content: fields.content,
      description: fields.description,
      image: flattenImageAssetFields(fields.image as Asset),
    },
  };
};

export default Page;
