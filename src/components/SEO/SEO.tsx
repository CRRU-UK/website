/* eslint-disable react/require-default-props */

import {
  NextSeo,
  LogoJsonLd,
  BreadcrumbJsonLd,
  SocialProfileJsonLd,
} from 'next-seo';

import type { SitemapItem } from '@/helpers/types';

import {
  DEFAULT_SITE_NAME,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_DOMAIN,
  DEFAULT_SEO_IMAGE,
} from '@/helpers/constants';

interface Props {
  page: SitemapItem,
  images?: Array<{
    url: string,
    width?: number,
    height?: number,
    alt?: string,
  }>,
  breadcrumbs: Array<SitemapItem>,
}

const SEO = ({
  page,
  images = DEFAULT_SEO_IMAGE,
  breadcrumbs,
}: Props) => {
  const {
    title,
    path,
    description = DEFAULT_SITE_DESCRIPTION,
  } = page;

  const pageCanonicalURL = `${DEFAULT_SITE_DOMAIN}${path}`;

  return (
    <>
      <NextSeo
        titleTemplate={`%s - ${DEFAULT_SITE_NAME}`}
        defaultTitle={DEFAULT_SITE_NAME}
        title={title}
        description={description}
        canonical={pageCanonicalURL}
        themeColor="#000000"
        openGraph={{
          url: pageCanonicalURL,
          title,
          description,
          images,
          siteName: DEFAULT_SITE_NAME,
        }}
      />

      <LogoJsonLd
        logo={`${DEFAULT_SITE_DOMAIN}/images/logo.png`}
        url={DEFAULT_SITE_DOMAIN}
      />

      <BreadcrumbJsonLd
        itemListElements={breadcrumbs.map((item, index) => ({
          position: index + 1,
          name: item.title,
          item: `${DEFAULT_SITE_DOMAIN}${item.path}`,
        }))}
      />

      <SocialProfileJsonLd
        type="Organization"
        name={DEFAULT_SITE_NAME}
        url={DEFAULT_SITE_DOMAIN}
        sameAs={[
          'https://instagram.com/crru.org.uk',
          'https://facebook.com/crru.org.uk',
          'https://twitter.com/CRRU',
          'https://youtube.com/@crruorguk',
          'https://linkedin.com/company/cetacean-research-&-rescue-unit-crru-',
        ]}
      />
    </>
  );
};

export default SEO;
