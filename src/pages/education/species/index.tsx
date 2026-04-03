import type { GetServerSideProps, NextPage } from "next";
import { Button } from "@/components";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";
import getSpecies from "@/helpers/getSpecies";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { PageData } from "@/helpers/types";
import CommonPage from "@/layout/CommonPage";

import styles from "./index.module.scss";

type SpeciesDataReduced = {
  name: string;
  slug: string;
};

interface PageProps {
  pageData: PageData;
  speciesData: Array<SpeciesDataReduced>;
}

const Page: NextPage<PageProps> = ({ pageData, speciesData }) => (
  <CommonPage
    breadcrumbs={[sitemap.education, sitemap["cetacean-fact-files"]]}
    data={pageData}
    page={sitemap["cetacean-fact-files"]}
    parent={sitemap.education}
  >
    <ul className={styles["contents-table"]}>
      {speciesData.map(({ name, slug }) => (
        <li key={slug}>
          <Button link={`/education/species/${slug}`} text={name} />
        </li>
      ))}
    </ul>
  </CommonPage>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const [pageData, speciesData] = await Promise.all([
    getPageContent(sitemap["cetacean-fact-files"].path, { preview }),
    getSpecies(),
  ]);

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      pageData,
      speciesData: speciesData.map(({ name, slug }) => ({ name, slug })),
    },
  };
};

export default Page;
