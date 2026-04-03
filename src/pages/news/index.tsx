import type { GetServerSideProps, NextPage } from "next";
import { Breadcrumbs, News, SEO } from "@/components";
import Hero from "@/components/Hero/Hero";
import sitemap from "@/data/sitemap.json";
import getNews from "@/helpers/getNews";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { NewsArticle } from "@/helpers/types";

interface PageProps {
  data: Array<NewsArticle>;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <>
    <SEO breadcrumbs={[sitemap.news]} page={sitemap.news} />

    <Hero plain title={sitemap.news.title} wide />

    <Breadcrumbs items={[sitemap.news]} style="wide" />

    <article className="wide">
      <div className="grid">
        {data.map((item) => (
          <News
            category={item.category}
            date={item.date}
            image={{
              src: item.image.url,
              alt: "",
              width: item.image.width,
              height: item.image.height,
            }}
            key={item.slug}
            link={`/news/${item.slug}`}
            title={item.title}
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
