import type { GetServerSideProps, NextPage } from "next";
import sitemap from "@/data/sitemap.json";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { PageData } from "@/helpers/types";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <CommonPage
    breadcrumbs={[sitemap.training, sitemap["gain-university-credits"]]}
    data={data}
    page={sitemap["gain-university-credits"]}
    parent={sitemap.training}
  />
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent(sitemap["gain-university-credits"].path, {
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
