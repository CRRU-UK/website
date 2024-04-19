import type { Asset } from 'contentful';
import type { NextPage, GetServerSideProps } from 'next';

import React, { useState } from 'react';

import type { FlattenedImage, PageData } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import getPageContent from '@/helpers/getPageContent';
import { UsefulLinksCategories } from '@/helpers/constants';
import { flattenImageAssetFields } from '@/helpers/flattenAssetFields';

import CommonPage from '@/layout/CommonPage';
import { ListItem, Filters } from '@/components/index';

type LinksDataReduced = {
  title: string,
  description?: string,
  category: string,
  url: string,
  image: FlattenedImage,
  background?: FlattenedImage,
};

interface PageProps {
  pageData: PageData,
  linksData: Array<LinksDataReduced> | null,
}

const categories = [
  'All categories',
  ...Object.values(UsefulLinksCategories),
];

const Page: NextPage<PageProps> = ({
  pageData,
  linksData,
}) => {
  const [allCategories] = categories;
  const [currentCategory, setCurrentCategory] = useState<string>(allCategories);

  const linksDataElements = linksData?.filter((item) => {
    if (currentCategory === allCategories) return true;
    return item.category === currentCategory;
  }).map((item) => {
    const categoryStyle = categories.indexOf(item.category);

    return (
      <ListItem
        key={item.title}
        title={item.title}
        description={item.description}
        link={item.url}
        category={{ text: item.category, style: categoryStyle ?? 1 }}
        image={item.image ?? undefined}
      />
    );
  });

  return (
    <CommonPage
      page={sitemap['useful-links']}
      parent={sitemap.about}
      breadcrumbs={[sitemap.about, sitemap['useful-links']]}
      data={pageData}
    >
      <>
        <Filters
          dropdowns={[{
            name: 'Categories',
            options: categories.map((value) => ({ text: value, value })),
            callback: setCurrentCategory,
          }]}
        />
        {linksDataElements}
      </>
    </CommonPage>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === 'true';
  const data = await getPageContent(sitemap['useful-links'].path, { preview, references: true });

  const {
    content,
    image,
    background,
    description,
    references,
  } = data;

  const linksData = references?.map(({ fields }) => ({
    title: fields.title as string,
    description: fields.description as string,
    category: fields.category as string,
    url: fields.url as string,
    image: flattenImageAssetFields(fields.image as Asset),
  })) ?? null;

  return {
    props: {
      preview,
      pageData: {
        content,
        image,
        background,
        description,
      },
      linksData,
    },
  };
};

export default Page;
