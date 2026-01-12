import type { Document } from "@contentful/rich-text-types";
import type { Asset } from "contentful";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import type { ContentTypeSpeciesPage, PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import { ContentTypes } from "@/helpers/constants";
import contentful from "@/helpers/contentful";
import { flattenImageAssetFields } from "@/helpers/flattenAssetFields";
import pageRenderOptions from "@/helpers/rendering";

import { Breadcrumbs, SEO } from "@/components";
import Hero from "@/components/Hero/Hero";

import styles from "./[slug].module.scss";

interface PageProps {
  id: string;
  name: string;
  description: string;
  slug: string;
  order: string;
  suborder: string;
  family: string;
  subfamily: string | null;
  genus: string;
  species: string;
  content: Document;
  image: PageData["image"];
}

const Page: NextPage<PageProps> = ({
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

  return (
    <>
      <SEO
        page={{
          title: `${name} - ${sitemap["cetacean-fact-files"].title}`,
          description: String(description),
          path: `/education/species/${slug}`,
        }}
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
        breadcrumbs={pageBreadcrumbs}
      />

      <Hero title={name} subtitle={sitemap["cetacean-fact-files"].title} background={image?.url} />

      <Breadcrumbs items={pageBreadcrumbs} />

      <article className="content">
        <ul className={styles.taxonomy}>
          <li>
            <strong>Order:</strong>
            <span>{order}</span>
          </li>
          <li>
            <strong>Suborder:</strong>
            <span>{suborder}</span>
          </li>
          <li>
            <strong>Family:</strong>
            <span>{family}</span>
          </li>
          {subfamily && (
            <li>
              <strong>Subfamily:</strong>
              <span>{subfamily}</span>
            </li>
          )}
          <li>
            <strong>Genus:</strong>
            <span>{genus}</span>
          </li>
          <li className={wide ? "" : styles.wide}>
            <strong>Species:</strong>
            <span>
              <em>{speciesName}</em> ({speciesYear}
            </span>
          </li>
        </ul>

        <span>{documentToReactComponents(content, pageRenderOptions)}</span>
      </article>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { items } = await contentful.getEntries<ContentTypeSpeciesPage>({
    content_type: ContentTypes.SpeciesPage,
    "fields.slug": slug,
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

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default Page;
