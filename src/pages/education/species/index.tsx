import type { NextPage, GetServerSideProps } from "next";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";
import getSpecies from "@/helpers/getSpecies";

import CommonPage from "@/layout/CommonPage";
import { Button } from "@/components";

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
    page={sitemap["cetacean-fact-files"]}
    parent={sitemap.education}
    breadcrumbs={[sitemap.education, sitemap["cetacean-fact-files"]]}
    data={pageData}
  >
    <ul className={styles["contents-table"]}>
      {speciesData.map(({ name, slug }) => (
        <li key={slug}>
          <Button text={name} link={`/education/species/${slug}`} />
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

  return {
    props: {
      preview,
      pageData,
      speciesData: speciesData.map(({ name, slug }) => ({ name, slug })),
    },
  };
};

export default Page;
