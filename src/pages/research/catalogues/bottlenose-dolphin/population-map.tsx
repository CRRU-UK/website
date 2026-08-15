import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { GetServerSideProps, NextPage } from "next";
import { Breadcrumbs, PopulationMap, SEO } from "@/components";

import sitemap from "@/data/sitemap.json";

import { Catalogues } from "@/helpers/constants";
import { getBottlenoseDolphinFamilyTrees } from "@/helpers/getCatalogue";
import getPageContent from "@/helpers/getPageContent";
import pageRenderOptions from "@/helpers/rendering";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { CatalogueFamilyNode, PageData } from "@/helpers/types";

import styles from "./population-map.module.scss";

const page = sitemap["population-map"];

interface PageProps {
  id: string | null;
  pageData: PageData;
  trees: Array<CatalogueFamilyNode>;
}

const Page: NextPage<PageProps> = ({ id, pageData, trees }: PageProps) => {
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
          <h1 className={styles.hidden}>{page.title}</h1>
        </div>

        <PopulationMap focusId={id} trees={trees}>
          <div className={styles.content}>
            {!!pageData.content && documentToReactComponents(pageData.content, pageRenderOptions)}
          </div>
        </PopulationMap>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";

  const [pageData, trees] = await Promise.all([
    getPageContent(page.path, { preview }),
    getBottlenoseDolphinFamilyTrees(),
  ]);

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      id: typeof ctx.query.id === "string" ? ctx.query.id : null,
      pageData,
      trees,
    },
  };
};

export default Page;
