import { BreadcrumbJsonLd } from "next-seo";
import { generateNextSeo } from "next-seo/pages";
import Head from "next/head";

import type { SitemapItem } from "@/helpers/types";

import {
  DEFAULT_SEO_IMAGE,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_DOMAIN,
  DEFAULT_SITE_NAME,
} from "@/helpers/constants";

interface Props {
  page: SitemapItem;
  type?: "website" | "article";
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  breadcrumbs: Array<SitemapItem>;
}

const SEO = ({ page, type = "website", images = DEFAULT_SEO_IMAGE, breadcrumbs }: Props) => {
  const { title, path, description = DEFAULT_SITE_DESCRIPTION } = page;

  const pageCanonicalURL = `${DEFAULT_SITE_DOMAIN}${path}`;

  return (
    <Head>
      {generateNextSeo({
        titleTemplate: `%s - ${DEFAULT_SITE_NAME}`,
        defaultTitle: DEFAULT_SITE_NAME,
        title,
        description,
        canonical: pageCanonicalURL,
        themeColor: "#000000",
        openGraph: {
          type,
          url: pageCanonicalURL,
          title,
          description,
          images,
          siteName: DEFAULT_SITE_NAME,
        },
      })}

      <BreadcrumbJsonLd
        items={breadcrumbs.map((item, index) => ({
          position: index + 1,
          name: item.title,
          item: `${DEFAULT_SITE_DOMAIN}${item.path}`,
        }))}
      />
    </Head>
  );
};

export default SEO;
