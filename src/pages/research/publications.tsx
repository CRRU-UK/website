import type { AssetFile } from "contentful";
import type { GetServerSideProps, NextPage } from "next";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import type { ContentTypeScientificPublication, FlattenedImage, PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import { ContentTypes, ScientificPublicationCategories } from "@/helpers/constants";
import { contentfulDeliveryClient } from "@/helpers/contentful";
import { flattenImageAssetFields } from "@/helpers/flattenAssetFields";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";

import { Filters } from "@/components";
import CommonPage from "@/layout/CommonPage";

import styles from "./publications.module.scss";

type PublicationDataReduced = {
  category: ScientificPublicationCategories;
  title: string;
  description: string;
  attachment: string | null;
  image: FlattenedImage | null;
};

interface PageProps {
  pageData: PageData;
  publicationsData: Array<PublicationDataReduced>;
}

const PublicationEntry = ({
  category,
  title,
  description,
  attachment,
  image,
}: PublicationDataReduced) => {
  let download = null;

  if (attachment) {
    download = (
      <Link
        href={`https:${attachment}`}
        className={styles.download}
        rel="noopener noreferrer"
        target="_blank"
      >
        View PDF
      </Link>
    );
  }

  const categoryClasses = [styles.category];
  if (category === ScientificPublicationCategories.ResearchPaper)
    categoryClasses.push(styles["category-peer-review"]);
  if (category === ScientificPublicationCategories.Report)
    categoryClasses.push(styles["category-reports"]);
  if (category === ScientificPublicationCategories.Conference)
    categoryClasses.push(styles["category-conferences"]);
  if (category === ScientificPublicationCategories.Thesis)
    categoryClasses.push(styles["category-theses"]);

  return (
    <article key={description} className={styles.item}>
      {image && (
        <Image
          src={image.url}
          alt={image.alt ?? "Publication cover image."}
          width={image.width}
          height={image.height}
          className={styles.image}
        />
      )}
      <div className={styles.wrapper}>
        <span className={styles.header}>
          <p className={styles.title}>{title}</p>
          <span className={categoryClasses.join(" ")}>{category}</span>
        </span>
        <ReactMarkdown>{description}</ReactMarkdown>
        {download}
      </div>
    </article>
  );
};

const categories = {
  all: "All categories",
  [ScientificPublicationCategories.ResearchPaper]: "Peer Reviewed Research Papers",
  [ScientificPublicationCategories.Report]: "Reports & Workshop Proceedings",
  [ScientificPublicationCategories.Conference]: "Conference Presentations",
  [ScientificPublicationCategories.Thesis]: "Theses",
};

const UsePublicationsContent = (data: Array<PublicationDataReduced>) => {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<keyof typeof categories>("all");

  const searchFilteredResults = (items: Array<PublicationDataReduced>) =>
    items
      .filter((item) => {
        if (search === "") return item;
        const searchText = search.toLowerCase();
        return [item.title, item.description].join("").toLowerCase().includes(searchText);
      })
      .filter((item) => {
        if (category === "all") return true;
        return item.category === category;
      });

  const filteredData = searchFilteredResults(data);

  return (
    <>
      <Filters
        search={{ callback: setSearch }}
        dropdowns={[
          {
            name: "Categories",
            options: Object.entries(categories).map(([key, value]) => ({
              text: value,
              value: key,
            })),
            callback: setCategory,
          },
        ]}
      />

      <div className={styles.info}>
        Showing {filteredData.length} of {data.length} publications
      </div>

      {filteredData.length ? (
        filteredData.map((item) => PublicationEntry(item))
      ) : (
        <p>No results for &quot;{search}&quot;</p>
      )}
    </>
  );
};

const Page: NextPage<PageProps> = ({ pageData, publicationsData }) => (
  <CommonPage
    page={sitemap.publications}
    parent={sitemap.research}
    breadcrumbs={[sitemap.research, sitemap.publications]}
    data={pageData}
    wide
  >
    {UsePublicationsContent(publicationsData)}
  </CommonPage>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const pageData = await getPageContent(sitemap.publications.path, { preview });

  const publicationsData =
    await contentfulDeliveryClient.getEntries<ContentTypeScientificPublication>({
      content_type: ContentTypes.ScientificPublication,
      order: ["-fields.date"],
      limit: 1000,
    });

  const publicationsDataReduced = publicationsData.items.map((item) => ({
    category: item.fields.category as ScientificPublicationCategories,
    title: item.fields.title,
    description: item.fields.description,
    attachment: (item.fields.attachment?.fields?.file as AssetFile)?.url || null,
    image: item.fields?.image ? flattenImageAssetFields(item.fields.image) : null,
  }));

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      pageData,
      publicationsData: publicationsDataReduced,
    },
  };
};

export default Page;
