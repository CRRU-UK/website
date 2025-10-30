import type { GetServerSideProps, NextPage } from "next";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <CommonPage
    page={sitemap["fundraising-support"]}
    parent={sitemap.help}
    breadcrumbs={[sitemap.help, sitemap["fundraising-support"]]}
    data={data}
  />
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent(sitemap["fundraising-support"].path, {
    preview,
  });

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      data,
    },
  };
};

export default Page;
