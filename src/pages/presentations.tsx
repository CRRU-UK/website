import type { NextPage, GetServerSideProps } from "next";

import Head from "next/head";

import type { PageData } from "@/helpers/types";

import getPageContent from "@/helpers/getPageContent";

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
      <meta name="robots" content="noindex,nofollow" />
    </Head>

    <CommonPage page={pageSitemap} breadcrumbs={[pageSitemap]} data={data} />
  </>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent("/presentations", { preview });

  return {
    props: {
      preview,
      data,
    },
  };
};

export default Page;
