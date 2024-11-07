import type { NextPage, GetServerSideProps } from 'next';

import sitemap from '@/data/sitemap.json';

import { DEFAULT_SITE_DOMAIN } from '@/helpers/constants';
import getSpecies from '@/helpers/getSpecies';
import getNews from '@/helpers/getNews';

const Page: NextPage = () => (
  <>Sitemap</>
);

const generateSiteMap = (
  additionalPages: Array<string>,
) => `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${Object.values(sitemap).filter(({ path }) => path.startsWith('/')).map(({ path }) => `
      <url>
        <loc>${DEFAULT_SITE_DOMAIN}${path}</loc>
      </url>
    `).join('\n')}
    ${additionalPages.map((path) => `
      <url>
        <loc>${DEFAULT_SITE_DOMAIN}${path}</loc>
      </url>
    `).join('\n')}
  </urlset>
`.trim();

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const [species, news] = await Promise.all([
    getSpecies(),
    getNews({ limit: 1000 }),
  ]);

  const additionalPages = [];

  if (species) {
    additionalPages.push(...species.map(({ slug }) => `/species/${slug}`));
  }

  if (news) {
    additionalPages.push(...news.map(({ slug }) => `/news/${slug}`));
  }

  const content = generateSiteMap(additionalPages);

  res.setHeader('Content-Type', 'text/xml');
  res.write(content);
  res.end();

  return {
    props: {},
  };
};

export default Page;
