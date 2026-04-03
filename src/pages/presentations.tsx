import type { GetServerSideProps, NextPage } from "next";

import Head from "next/head";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { PageData } from "@/helpers/types";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
}

const pageSitemap = {
  title: "Presentations",
  path: "/presentations",
};

const Page: NextPage<PageProps> = ({ data }) => (
  <>
    <Head>
      <meta content="noindex,nofollow" name="robots" />
    </Head>

    <CommonPage breadcrumbs={[pageSitemap]} data={data} page={pageSitemap} />
  </>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent("/presentations", { preview });

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
