import type { Asset } from "contentful";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { ParsedUrlQuery } from "node:querystring";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { ArticleJsonLd } from "next-seo";

import type { ContentTypeNews, NewsArticle } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import { ContentTypes, DEFAULT_SITE_DOMAIN, DEFAULT_SITE_NAME } from "@/helpers/constants";
import contentful from "@/helpers/contentful";
import { flattenImageAssetFields } from "@/helpers/flattenAssetFields";
import { formatDateRelative } from "@/helpers/formatDate";
import pageRenderOptions from "@/helpers/rendering";

import { Breadcrumbs, SEO } from "@/components";
import Hero from "@/components/Hero/Hero";

interface PageProps extends NewsArticle {
  id: string;
}

const Page: NextPage<PageProps> = ({
  title,
  slug,
  date,
  category,
  content,
  description,
  image,
}) => {
  const pageTitle = title;
  const pageBody = documentToReactComponents(content, pageRenderOptions);
  const pagePath = `/news/${slug}`;
  const pageBreadcrumbs = [sitemap.news, { title: pageTitle, description, path: pagePath }];

  const formattedDate = new Date(date).toISOString();

  return (
    <>
      <SEO
        page={{
          title: `${pageTitle} - ${sitemap.news.title}`,
          description,
          path: pagePath,
        }}
        type="article"
        images={[
          {
            url: image.url,
            width: image.width,
            height: image.height,
          },
        ]}
        breadcrumbs={pageBreadcrumbs}
      />

      <ArticleJsonLd
        type="NewsArticle"
        url={`${DEFAULT_SITE_DOMAIN}${pagePath}`}
        headline={pageTitle}
        image={[image.url]}
        datePublished={formattedDate}
        dateModified={formattedDate}
        author={[{ name: DEFAULT_SITE_NAME, url: DEFAULT_SITE_DOMAIN }]}
        publisher={{
          "@type": "Organization",
          name: DEFAULT_SITE_NAME,
          logo: `${DEFAULT_SITE_DOMAIN}/images/logo.png`,
        }}
        description={description}
      />

      <Hero title={pageTitle} subtitle={sitemap.news.title} plain />

      <Breadcrumbs items={pageBreadcrumbs} />

      <ul className="details">
        <li className="date" title={date}>
          {formatDateRelative(date)}
        </li>
        <li className="category">{category}</li>
      </ul>

      <article className="content">{pageBody}</article>
    </>
  );
};

interface PageParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params as PageParams;

  const { items } = await contentful.getEntries<ContentTypeNews>({
    content_type: ContentTypes.NewsArticle,
    "fields.slug": slug,
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
      id: sys.id,
      title: fields.title,
      slug: fields.slug,
      date: fields.date,
      category: fields.category,
      content: fields.content,
      description: fields.description,
      image: flattenImageAssetFields(fields.image as Asset),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default Page;
