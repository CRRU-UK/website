import type { NextPage, GetServerSideProps } from 'next';

import { CourseJsonLd } from 'next-seo';

import type { PageData } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import { DEFAULT_SITE_NAME, DEFAULT_SITE_DOMAIN } from '@/helpers/constants';
import getPageContent from '@/helpers/getPageContent';

import CommonPage from '@/layout/CommonPage';

interface PageProps {
  data: PageData,
}

const Page: NextPage<PageProps> = ({
  data,
}) => (
  <>
    <CourseJsonLd
      courseName={sitemap['summer-training-placements'].title}
      description={data.description ?? ''}
      provider={{
        name: DEFAULT_SITE_NAME,
        url: `${DEFAULT_SITE_DOMAIN}${sitemap['summer-training-placements'].path}`,
      }}
    />

    <CommonPage
      page={sitemap['summer-training-placements']}
      parent={sitemap.training}
      breadcrumbs={[sitemap.training, sitemap['summer-training-placements']]}
      data={data}
    />
  </>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === 'true';
  const data = await getPageContent(sitemap['summer-training-placements'].path, { preview });

  return {
    props: {
      preview,
      data,
    },
  };
};

export default Page;
