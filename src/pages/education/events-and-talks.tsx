import type { NextPage, GetServerSideProps } from 'next';

import type { PageData } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import getPageContent from '@/helpers/getPageContent';

import CommonPage from '@/layout/CommonPage';

interface PageProps {
  data: PageData,
}

const Page: NextPage<PageProps> = ({
  data,
}) => (
  <CommonPage
    page={sitemap['events-and-talks']}
    parent={sitemap.education}
    breadcrumbs={[sitemap.education, sitemap['events-and-talks']]}
    data={data}
  />
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const data = await getPageContent(sitemap['events-and-talks'].path, { preview: !!ctx?.query?.preview });

  return {
    props: {
      data,
    },
  };
};

export default Page;
