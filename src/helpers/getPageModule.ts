import { ContentTypes } from "./constants";
import { contentfulDeliveryClient } from "./contentful";
import parseSafe from "./parseSafe";
import type { ContentTypePageModule, PageModule } from "./types";

/**
 * Queries and returns a page module entry from Contentful.
 * @param id ID field to query.
 * @returns Species page entries.
 */
const getPageModule = async (id: string): Promise<PageModule | null> => {
  const response = await contentfulDeliveryClient.getEntries<ContentTypePageModule>({
    content_type: ContentTypes.PageModule,
    "fields.id": id,
    limit: 1,
  });

  const { items } = parseSafe(response);

  if (!items.length) {
    return null;
  }

  const [{ fields }] = items;

  return {
    content: fields.content,
    data: fields?.data ?? null,
  };
};

export default getPageModule;
