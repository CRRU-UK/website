import type { PageModule, ContentTypePageModule } from "./types";

import { ContentTypes } from "./constants";
import { contentfulDeliveryClient } from "./contentful";

/**
 * Queries and returns a page module entry from Contentful.
 * @param id ID field to query.
 * @returns Species page entries.
 */
const getPageModule = async (id: string): Promise<PageModule | null> => {
  const { items } =
    await contentfulDeliveryClient.getEntries<ContentTypePageModule>({
      content_type: ContentTypes.PageModule,
      "fields.id": id,
      limit: 1,
    });

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
