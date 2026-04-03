import type { Asset } from "contentful";
import type { GetServerSideProps, NextPage } from "next";

import { useState } from "react";
import { Filters, ListItem } from "@/components";

import sitemap from "@/data/sitemap.json";

import { UsefulLinksCategories } from "@/helpers/constants";
import { flattenImageAssetFields } from "@/helpers/flattenAssetFields";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { FlattenedImage, PageData } from "@/helpers/types";
import CommonPage from "@/layout/CommonPage";

type LinksDataReduced = {
  title: string;
  description?: string;
  category: string;
  url: string;
  image: FlattenedImage;
  background?: FlattenedImage;
};

interface PageProps {
  linksData: Array<LinksDataReduced> | null;
  pageData: PageData;
}

const categories = ["All categories", ...Object.values(UsefulLinksCategories)];

const Page: NextPage<PageProps> = ({ pageData, linksData }) => {
  const [allCategories] = categories;
  const [currentCategory, setCurrentCategory] = useState<string>(allCategories);

  const linksDataElements = linksData
    ?.filter((item) => {
      if (currentCategory === allCategories) return true;
      return item.category === currentCategory;
    })
    .map((item) => {
      const categoryStyle = categories.indexOf(item.category);

      return (
        <ListItem
          category={{ text: item.category, style: categoryStyle ?? 1 }}
          description={item.description}
          image={item.image ?? undefined}
          key={item.title}
          link={item.url}
          title={item.title}
        />
      );
    });

  return (
    <CommonPage
      breadcrumbs={[sitemap.about, sitemap["useful-links"]]}
      data={pageData}
      page={sitemap["useful-links"]}
      parent={sitemap.about}
    >
      {/* biome-ignore lint/complexity/noUselessFragments: fragment needed to satisfy children type */}
      <>
        <Filters
          dropdowns={[
            {
              name: "Categories",
              options: categories.map((value) => ({ text: value, value })),
              callback: setCurrentCategory,
            },
          ]}
        />
        {linksDataElements}
      </>
    </CommonPage>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent(sitemap["useful-links"].path, {
    preview,
    references: true,
  });

  const { content, image, background, description, references } = data;

  const linksData =
    references?.map(({ fields }) => ({
      title: fields.title as string,
      description: fields.description as string,
      category: fields.category as string,
      url: fields.url as string,
      image: flattenImageAssetFields(fields.image as Asset),
    })) ?? null;

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      pageData: {
        content,
        image,
        background,
        description,
      },
      linksData,
    },
  };
};

export default Page;
