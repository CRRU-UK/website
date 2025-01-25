import type { NextPage, GetServerSideProps } from "next";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <CommonPage
    page={sitemap.collaborators}
    parent={sitemap.research}
    breadcrumbs={[sitemap.research, sitemap.collaborators]}
    data={data}
  />
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent(sitemap.collaborators.path, { preview });

  return {
    props: {
      preview,
      data,
    },
  };
};

export default Page;
