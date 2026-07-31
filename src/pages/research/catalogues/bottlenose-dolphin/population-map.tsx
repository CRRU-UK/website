import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { GetServerSideProps, NextPage } from "next";
import { Breadcrumbs, PopulationMap, SEO } from "@/components";

import sitemap from "@/data/sitemap.json";

import { Catalogues } from "@/helpers/constants";
import { getBottlenoseDolphinFamilyForest } from "@/helpers/getCatalogue";
import getPageContent from "@/helpers/getPageContent";
import pageRenderOptions from "@/helpers/rendering";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { CatalogueFamilyNode, PageData } from "@/helpers/types";

import styles from "./population-map.module.scss";

const page = sitemap["population-map"];

interface PageProps {
  entry: string | null;
  pageData: PageData;
  trees: Array<CatalogueFamilyNode>;
}

const Page: NextPage<PageProps> = ({ entry, pageData, trees }: PageProps) => {
  const breadcrumbs = [
    sitemap.research,
    {
      title: sitemap.catalogues.title,
      path: `${sitemap.catalogues.path}?catalogue=${Catalogues.BottlenoseDolphin}`,
    },
    page,
  ];

  return (
    <>
      <SEO
        breadcrumbs={breadcrumbs}
        page={{ ...page, description: pageData.description ?? undefined }}
      />

      <section className={styles.page}>
        <div className={styles.intro}>
          <Breadcrumbs items={breadcrumbs} style="inline" />

          <div className={styles.wrapper}>
            <h1 className={styles.hidden}>{page.title}</h1>
            {!!pageData.content && documentToReactComponents(pageData.content, pageRenderOptions)}
          </div>
        </div>

        <PopulationMap entry={entry} trees={trees} />
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";

  const [pageData, trees] = await Promise.all([
    getPageContent(page.path, { preview }),
    getBottlenoseDolphinFamilyForest(),
  ]);

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      entry: typeof ctx.query.entry === "string" ? ctx.query.entry : null,
      pageData,
      trees,
    },
  };
};

export default Page;
