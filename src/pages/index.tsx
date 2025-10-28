import type { NextPage, GetServerSideProps } from "next";
import type { Asset, Entry } from "contentful";

import React, { useRef, useState, useEffect } from "react";
import { OrganizationJsonLd } from "next-seo";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import type {
  ContentTypeHomepage,
  FlattenedImage,
  FlattenedVideo,
  NewsArticle,
  ContentTypeNews,
  ContentTypePageContent,
  ContentTypeSpeciesPage,
} from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import { contentfulDeliveryClient, contentfulPreviewClient } from "@/helpers/contentful";
import { flattenImageAssetFields, flattenVideoAssetFields } from "@/helpers/flattenAssetFields";
import getNews from "@/helpers/getNews";
import { setPageCacheHeaders } from "@/helpers/setHeaders";

import {
  ContentTypes,
  DEFAULT_SITE_NAME,
  DEFAULT_SITE_ALTERNATE_NAME,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_DOMAIN,
  SOCIAL_MEDIA_ACCOUNTS,
} from "@/helpers/constants";

import { News, SEO } from "@/components";

import styles from "./index.module.scss";

interface PageProps {
  homepage: {
    heroVideos: Array<FlattenedVideo>;
    heroImage: FlattenedImage;
    highlightLeftTitle: string;
    highlightLeftSubtitle: string;
    highlightLeftImage: FlattenedImage;
    highlightLeftLink: string;
    highlightRightTitle: string;
    highlightRightSubtitle: string;
    highlightRightImage: FlattenedImage;
    highlightRightLink: string;
  };
  newsArticles: Array<NewsArticle>;
}

const Page: NextPage<PageProps> = ({ homepage, newsArticles }: PageProps) => {
  const videoElement = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(true);

  const toggleVideoPlaying = () => setVideoPlaying(!videoPlaying);

  useEffect(() => {
    if (!videoElement?.current) {
      return;
    }

    videoElement.current.playsInline = true;

    if (videoPlaying) {
      videoElement.current.play().catch();
    } else {
      videoElement.current.pause();
    }
  }, [videoPlaying]);

  return (
    <>
      <SEO
        page={{
          title: "Cetacean Research & Rescue Unit",
          path: sitemap.home.path,
        }}
        breadcrumbs={[sitemap.home]}
      />

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: DEFAULT_SITE_NAME,
              alternateName: DEFAULT_SITE_ALTERNATE_NAME,
              url: DEFAULT_SITE_DOMAIN,
            }),
          }}
        />
      </Head>

      <OrganizationJsonLd
        type="Organization"
        name={DEFAULT_SITE_NAME}
        alternateName={DEFAULT_SITE_ALTERNATE_NAME}
        description={DEFAULT_SITE_DESCRIPTION}
        url={DEFAULT_SITE_DOMAIN}
        logo="https://crru.org.uk/images/logo.png"
        foundingDate="1999"
        address={{
          streetAddress: "48 Seatown",
          addressLocality: "Banff",
          addressRegion: "Scotland",
          postalCode: "AB45 3YQ",
          addressCountry: "GB",
        }}
        contactPoint={[
          {
            telephone: "+44-0126-185-1696",
            contactType: "General",
            email: "info@crru.org.uk",
          },
        ]}
        sameAs={SOCIAL_MEDIA_ACCOUNTS}
      />

      <section className={styles.banner}>
        <div className={styles["banner-text"]}>
          <h1>
            Dedicated to the understanding, conservation and protection of cetaceans in Scottish
            waters
          </h1>
          <Link href={sitemap.about.path} className={styles["banner-cta"]}>
            Learn more
            <svg fill="none" width="64" height="64" viewBox="0 0 64 64">
              <path d="m29.1751 1.21006c1.5601-1.560149 4.0896-1.560149 5.6498 0l27.965 27.96504c.0145.0145.0288.029.0431.0437l.0423.0443.0064.0068c.3295.3515.5835.7482.7619 1.1692l.0025.0059c.186.4397.2955.9196.3118 1.4231l.0001.0076.0002.0016c.0018.0613.0018.1227.0018.184v.0048c-.0087.5055-.1108.9882-.2901 1.4314l-.0017.0039-.0007.0019c-.156.3847-.3744.7501-.6552 1.0805l-.0101.0115-.0038.0046-.0084.0096-.0203.0236c-.0144.0164-.0289.0326-.0436.0488l-.0066.007-.0024.0029-.0132.014-.0222.0243-.005.0051-.0013.0016c-.0141.0149-.0282.0297-.0424.0444l-.0431.0437-27.965 27.965c-1.5602 1.5602-4.0897 1.5602-5.6498 0-1.5601-1.5601-1.5601-4.0896 0-5.6498l21.1452-21.1452-46.28535.0001c-2.18431 0-3.9591882-1.753-3.9950025-3.9289v-.0661c0-2.2064 1.7886225-3.995 3.9950025-3.995h46.28535l-21.1452-21.14515c-1.5445-1.54455-1.56-4.03915-.0463-5.6027z" />
            </svg>
          </Link>
        </div>

        <button
          className={`${styles["video-toggle"]} ${videoPlaying ? styles["video-toggle-playing"] : styles["video-toggle-paused"]}`}
          onClick={toggleVideoPlaying}
          onKeyDown={toggleVideoPlaying}
          type="button"
          tabIndex={0}
          title={videoPlaying ? "Pause video" : "Play video"}
          aria-label={videoPlaying ? "Pause video" : "Play video"}
        />

        <video poster={homepage.heroImage.url} ref={videoElement} playsInline autoPlay muted loop>
          {homepage.heroVideos.map((item) => (
            <source src={item.url} type={item.type} key={item.url} />
          ))}
        </video>
      </section>

      <section className={styles.highlights}>
        <Link href={homepage.highlightLeftLink} className={styles["highlights-item"]}>
          <span className={styles["highlights-item-title"]}>{homepage.highlightLeftTitle}</span>
          <span className={styles["highlights-item-subtitle"]}>
            {homepage.highlightLeftSubtitle}
          </span>
          <Image
            src={homepage.highlightLeftImage.url}
            alt={homepage.highlightLeftImage.alt ?? ""}
            width={1100}
            height={550}
          />
        </Link>

        <Link href={homepage.highlightRightLink} className={styles["highlights-item"]}>
          <span className={styles["highlights-item-title"]}>{homepage.highlightRightTitle}</span>
          <span className={styles["highlights-item-subtitle"]}>
            {homepage.highlightRightSubtitle}
          </span>
          <Image
            src={homepage.highlightRightImage.url}
            alt={homepage.highlightRightImage.alt ?? ""}
            width={1100}
            height={550}
          />
        </Link>
      </section>

      <section className={styles.news}>
        <h2>Latest News</h2>

        <div className={styles["news-container"]}>
          {newsArticles.map((item) => (
            <News
              key={item.slug}
              link={`/news/${item.slug}`}
              image={{
                src: item.image.url,
                alt: item.image?.alt ?? "",
                width: item.image.width,
                height: item.image.height,
              }}
              title={item.title}
              date={item.date}
              category={item.category}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";

  let client = contentfulDeliveryClient;
  if (preview) {
    client = contentfulPreviewClient;
  }

  const [homepageData, newsArticles] = await Promise.all([
    client.getEntries<ContentTypeHomepage>({
      content_type: ContentTypes.Homepage,
      limit: 1,
      include: 2,
    }),
    getNews({ limit: 3 }),
  ]);

  const [{ fields }] = homepageData.items;

  const flattenReference = (
    data: Entry<ContentTypeNews | ContentTypePageContent | ContentTypeSpeciesPage> | undefined,
  ) => {
    if (!data) {
      return "";
    }

    const contentTypeID = data?.sys?.contentType?.sys?.id;

    if (contentTypeID === ContentTypes.NewsArticle) {
      return `/news/${(data as Entry<ContentTypeNews>).fields.slug}`;
    }

    if (contentTypeID === ContentTypes.PageContent) {
      return `${(data as Entry<ContentTypePageContent>).fields.path}`;
    }

    if (contentTypeID === ContentTypes.SpeciesPage) {
      return `/education/species/${(data as Entry<ContentTypeSpeciesPage>).fields.slug}`;
    }

    return "";
  };

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      homepage: {
        heroVideos: fields.heroVideos.map((item) => flattenVideoAssetFields(item as Asset)),
        heroImage: flattenImageAssetFields(fields.heroImage as Asset),
        highlightLeftTitle: fields.highlightLeftTitle,
        highlightLeftSubtitle: fields.highlightLeftSubtitle,
        highlightLeftImage: flattenImageAssetFields(fields.highlightLeftImage as Asset),
        highlightLeftLink: flattenReference(fields.highlightLeftLink),
        highlightRightTitle: fields.highlightRightTitle,
        highlightRightSubtitle: fields.highlightRightSubtitle,
        highlightRightImage: flattenImageAssetFields(fields.highlightRightImage as Asset),
        highlightRightLink: flattenReference(fields.highlightRightLink),
      },
      newsArticles,
    },
  };
};

export default Page;
