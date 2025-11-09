import type { Asset } from "contentful";
import type { GetServerSideProps, NextPage } from "next";

import type { FlattenedImage, PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import { flattenImageAssetFields } from "@/helpers/flattenAssetFields";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";

import { ListItem } from "@/components";
import CommonPage from "@/layout/CommonPage";

type SponsorsDataReduced = {
  name: string;
  description: string;
  url: string;
  image: FlattenedImage;
  background?: FlattenedImage;
};

interface PageProps {
  pageData: PageData;
  sponsorsData: Array<SponsorsDataReduced> | null;
}

const Page: NextPage<PageProps> = ({ pageData, sponsorsData }) => (
  <CommonPage
    page={sitemap.sponsors}
    parent={sitemap.about}
    breadcrumbs={[sitemap.about, sitemap.sponsors]}
    data={pageData}
  >
    {sponsorsData
      ? sponsorsData.map((item) => (
          <ListItem
            key={item.name}
            title={item.name}
            description={item.description}
            link={item.url}
            image={item.image}
          />
        ))
      : undefined}
  </CommonPage>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";

  const data = await getPageContent(sitemap.sponsors.path, {
    references: true,
    preview,
  });

  const { content, image, background, description, references } = data;

  const sponsorsData =
    references?.map(({ fields }) => ({
      name: fields.name as string,
      url: fields.url as string,
      description: fields.description as string,
      image: flattenImageAssetFields(fields.image as Asset),
    })) ?? null;

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      pageData: {
        preview,
        content,
        image,
        background,
        description,
      },
      sponsorsData,
    },
  };
};

export default Page;
