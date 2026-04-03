import type { GetServerSideProps, NextPage } from "next";

import { CourseJsonLd } from "next-seo";
import sitemap from "@/data/sitemap.json";
import { DEFAULT_SITE_DOMAIN, DEFAULT_SITE_NAME } from "@/helpers/constants";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { PageData } from "@/helpers/types";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <>
    <CourseJsonLd
      description={data.description ?? ""}
      name={sitemap["pam-training"].title}
      provider={{
        name: DEFAULT_SITE_NAME,
        url: `${DEFAULT_SITE_DOMAIN}${sitemap["pam-training"].path}`,
      }}
      {...data.data}
    />

    <CommonPage
      breadcrumbs={[sitemap.training, sitemap["pam-training"]]}
      data={data}
      page={sitemap["pam-training"]}
      parent={sitemap.training}
    />
  </>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent(sitemap["pam-training"].path, { preview });

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
