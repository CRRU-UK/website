import type { GetStaticProps, NextPage } from "next";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <CommonPage
    page={sitemap["ethics-statement"]}
    parent={sitemap.research}
    breadcrumbs={[sitemap.research, sitemap["ethics-statement"]]}
    data={data}
  />
);

export const getStaticProps: GetStaticProps = async () => {
  const data = await getPageContent(sitemap["ethics-statement"].path, {});

  return {
    props: {
      data,
    },
  };
};

export default Page;
