import type { ContentTypePageContent, PageData } from "./types";

import { ContentTypes } from "./constants";
import contentful from "./contentful";
import { flattenImageAssetFields } from "./flattenAssetFields";

interface Options {
  references?: boolean;
}

/**
 * Queries and returns a page content entry from Contentful.
 * @param path Path field to query.
 * @returns Species page entries.
 */
const getPageContent = async (path: string, options?: Options): Promise<PageData> => {
  const { items } = await contentful.getEntries<ContentTypePageContent>({
    content_type: ContentTypes.PageContent,
    "fields.path": path,
    limit: 1,
    include: 2,
  });

  const [{ sys, fields }] = items;

  const pageData: PageData = {
    id: sys.id,
    description: fields.description ?? null,
    content: fields.content ?? null,
    data: fields.data ?? null,
    image: fields.image ? flattenImageAssetFields(fields.image) : null,
    background: fields.background ? flattenImageAssetFields(fields.background) : null,
  };

  if (options?.references) {
    pageData.references = (fields.references as PageData["references"]) ?? null;
  }

  return pageData;
};

export default getPageContent;
