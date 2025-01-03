import type { Asset } from "contentful";

import type { ContentTypeNews, NewsArticle } from "./types";

import { ContentTypes } from "./constants";

import { contentfulDeliveryClient } from "./contentful";
import { flattenImageAssetFields } from "./flattenAssetFields";

interface Options {
  limit?: number;
}

/**
 * Queries and returns news articles entries from Contentful.
 * @param options Options.
 * @param [options.limit] Number of entries to query.
 * @returns News article entries.
 */
const getNews = async ({
  limit = 1000,
}: Options): Promise<Array<NewsArticle>> => {
  const { items } = await contentfulDeliveryClient.getEntries<ContentTypeNews>({
    content_type: ContentTypes.NewsArticle,
    order: ["-fields.date"],
    limit,
  });

  const data = items.map(({ fields }) => ({
    title: fields.title,
    slug: fields.slug,
    date: fields.date,
    category: fields.category,
    keywords: fields.keywords ?? [],
    content: fields.content,
    description: fields.description,
    image: flattenImageAssetFields(fields.image as Asset),
  }));

  return data;
};

export default getNews;
