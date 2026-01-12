import type { GetStaticProps, NextPage } from "next";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <CommonPage page={sitemap.help} breadcrumbs={[sitemap.help]} data={data} />
);

export const getStaticProps: GetStaticProps = async () => {
  const data = await getPageContent(sitemap.help.path);

  return {
    props: {
      data,
    },
  };
};

export default Page;
