import type { GetStaticProps, NextPage } from "next";

import type { PageData } from "@/helpers/types";

import Head from "next/head";

import sitemap from "@/data/sitemap.json";

import { DEFAULT_SITE_DOMAIN, DEFAULT_SITE_NAME } from "@/helpers/constants";
import getPageContent from "@/helpers/getPageContent";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
  courseSchema: object;
}

const Page: NextPage<PageProps> = ({ data, courseSchema }) => (
  <>
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: courseSchema,
          }),
        }}
      />
    </Head>

    <CommonPage page={sitemap.training} breadcrumbs={[sitemap.training]} data={data} />
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const data = await getPageContent(sitemap.training.path);

  const subPages = [
    sitemap["summer-training-placements"],
    sitemap["mmo-training"],
    sitemap["pam-training"],
  ];

  const subPageData = await Promise.all(subPages.map(({ path }) => getPageContent(path)));

  const courseSchema = subPageData.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Course",
      url: `${DEFAULT_SITE_DOMAIN}${subPages[index].path}`,
      name: subPages[index].title,
      description: item.description,
      provider: {
        "@type": "Organization",
        name: DEFAULT_SITE_NAME,
        sameAs: DEFAULT_SITE_DOMAIN,
      },
      ...item?.data,
    },
  }));

  return {
    props: {
      data,
      courseSchema,
    },
  };
};

export default Page;
