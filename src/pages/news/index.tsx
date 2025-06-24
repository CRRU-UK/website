import type { NextPage, GetServerSideProps } from "next";

import type { NewsArticle } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getNews from "@/helpers/getNews";
import { setPageCacheHeaders } from "@/helpers/setHeaders";

import Hero from "@/components/Hero/Hero";
import { Breadcrumbs, News, SEO } from "@/components";

interface PageProps {
  data: Array<NewsArticle>;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <>
    <SEO page={sitemap.news} breadcrumbs={[sitemap.news]} />

    <Hero title={sitemap.news.title} wide plain />

    <Breadcrumbs items={[sitemap.news]} style="wide" />

    <article className="wide">
      <div className="grid">
        {data.map((item) => (
          <News
            key={item.slug}
            link={`/news/${item.slug}`}
            image={{
              src: item.image.url,
              alt: "",
              width: item.image.width,
              height: item.image.height,
            }}
            title={item.title}
            date={item.date}
            category={item.category}
          />
        ))}
      </div>
    </article>
  </>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const data = await getNews({ limit: 1000 });

  setPageCacheHeaders(ctx);

  return {
    props: {
      data,
    },
  };
};

export default Page;
