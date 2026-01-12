import type { GetStaticProps, NextPage } from "next";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";
import getSpecies from "@/helpers/getSpecies";

import { Button } from "@/components";
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

export const getStaticProps: GetStaticProps = async () => {
  const [pageData, speciesData] = await Promise.all([
    getPageContent(sitemap["cetacean-fact-files"].path),
    getSpecies(),
  ]);

  return {
    props: {
      pageData,
      speciesData: speciesData.map(({ name, slug }) => ({ name, slug })),
    },
  };
};

export default Page;
