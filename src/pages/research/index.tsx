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
    page={sitemap.research}
    breadcrumbs={[sitemap.research]}
    data={data}
  />
);

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const data = await getPageContent(sitemap.research.path);

  return {
    props: {
      data,
    },
  };
};

export default Page;
