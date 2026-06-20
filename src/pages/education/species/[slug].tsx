import type { ParsedUrlQuery } from "node:querystring";
import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import type { Asset } from "contentful";
import type { GetServerSideProps, NextPage } from "next";
import { Breadcrumbs, SEO } from "@/components";
import Hero from "@/components/Hero/Hero";

import sitemap from "@/data/sitemap.json";

import { ContentTypes, LOCALE } from "@/helpers/constants";
import { contentfulDeliveryClient, contentfulPreviewClient } from "@/helpers/contentful";
import { flattenImageAssetFields } from "@/helpers/flattenAssetFields";
import pageRenderOptions from "@/helpers/rendering";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { ContentTypeSpeciesPage, PageData } from "@/helpers/types";

import styles from "./[slug].module.scss";

interface PageProps {
  content: Document;
  description: string;
  family: string;
  genus: string;
  id: string;
  image: PageData["image"];
  name: string;
  order: string;
  slug: string;
  species: string;
  subfamily: string | null;
  suborder: string;
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
  const [speciesName, speciesYear] = species.split("(");

  const pageBreadcrumbs = [
    sitemap.education,
    sitemap["cetacean-fact-files"],
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
        breadcrumbs={pageBreadcrumbs}
        images={
          image
            ? [
                {
                  url: image.url,
                  width: image.width,
                  height: image.height,
                },
              ]
            : undefined
        }
        page={{
          title: `${name} - ${sitemap["cetacean-fact-files"].title}`,
          description: String(description),
          path: `/education/species/${slug}`,
        }}
      />

      <Hero background={image?.url} subtitle={sitemap["cetacean-fact-files"].title} title={name} />

      <Breadcrumbs items={pageBreadcrumbs} />

      <article className="content">
        <ul className={styles.taxonomy}>
          <li>
            <strong>Order:</strong>
            <span
              {...previewProps({
                entryId: previewData.sys.id,
                fieldId: "order",
              })}
            >
              {order}
            </span>
          </li>
          <li>
            <strong>Suborder:</strong>
            <span
              {...previewProps({
                entryId: previewData.sys.id,
                fieldId: "suborder",
              })}
            >
              {suborder}
            </span>
          </li>
          <li>
            <strong>Family:</strong>
            <span
              {...previewProps({
                entryId: previewData.sys.id,
                fieldId: "family",
              })}
            >
              {family}
            </span>
          </li>
          {!!subfamily && (
            <li>
              <strong>Subfamily:</strong>
              <span
                {...previewProps({
                  entryId: previewData.sys.id,
                  fieldId: "subfamily",
                })}
              >
                {subfamily}
              </span>
            </li>
          )}
          <li>
            <strong>Genus:</strong>
            <span
              {...previewProps({
                entryId: previewData.sys.id,
                fieldId: "genus",
              })}
            >
              {genus}
            </span>
          </li>
          <li className={wide ? "" : styles.wide}>
            <strong>Species:</strong>
            <span
              {...previewProps({
                entryId: previewData.sys.id,
                fieldId: "species",
              })}
            >
              <em>{speciesName}</em> ({speciesYear}
            </span>
          </li>
        </ul>

        <span {...previewProps({ entryId: previewData.sys.id, fieldId: "content" })}>
          {documentToReactComponents(content, pageRenderOptions)}
        </span>
      </article>
    </>
  );
};

interface PageParams extends ParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";

  const { slug } = ctx.params as PageParams;

  const client = preview ? contentfulPreviewClient : contentfulDeliveryClient;
  const { items } = await client.getEntries<ContentTypeSpeciesPage>({
    content_type: ContentTypes.SpeciesPage,
    "fields.slug": slug,
    limit: 1,
  });

  if (!items.length) {
    return { notFound: true };
  }

  const [{ sys, fields }] = items;

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
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
