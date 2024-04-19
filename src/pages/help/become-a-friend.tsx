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
    page={sitemap['become-a-friend']}
    parent={sitemap.help}
    breadcrumbs={[sitemap.help, sitemap['become-a-friend']]}
    data={data}
  />
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === 'true';
  const data = await getPageContent(sitemap['become-a-friend'].path, { preview });

  return {
    props: {
      preview,
      data,
    },
  };
};

export default Page;
