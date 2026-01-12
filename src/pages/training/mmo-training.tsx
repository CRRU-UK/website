import type { GetStaticProps, NextPage } from "next";

import { CourseJsonLd } from "next-seo";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import { DEFAULT_SITE_DOMAIN, DEFAULT_SITE_NAME } from "@/helpers/constants";
import getPageContent from "@/helpers/getPageContent";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <>
    <CourseJsonLd
      name={sitemap["mmo-training"].title}
      description={data.description ?? ""}
      provider={{
        name: DEFAULT_SITE_NAME,
        url: `${DEFAULT_SITE_DOMAIN}${sitemap["mmo-training"].path}`,
      }}
      {...data.data}
    />

    <CommonPage
      page={sitemap["mmo-training"]}
      parent={sitemap.training}
      breadcrumbs={[sitemap.training, sitemap["mmo-training"]]}
      data={data}
    />
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const data = await getPageContent(sitemap["mmo-training"].path);

  return {
    props: {
      data,
    },
  };
};

export default Page;
