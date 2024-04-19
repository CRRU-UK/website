import type { PageData, ContentTypePageContent } from './types';

import { ContentTypes } from './constants';
import { contentfulDeliveryClient, contentfulPreviewClient } from './contentful';
import { flattenImageAssetFields } from './flattenAssetFields';

interface Options {
  references?: boolean,
  preview?: boolean,
}

/**
 * Queries and returns a page content entry from Contentful.
 * @param path Path field to query.
 * @returns Species page entries.
 */
const getPageContent = async (
  path: string,
  options?: Options,
): Promise<PageData> => {
  let client = contentfulDeliveryClient;
  if (options?.preview) {
    client = contentfulPreviewClient;
  }

  const { items } = await client.getEntries<ContentTypePageContent>({
    content_type: ContentTypes.PageContent,
    'fields.path': path,
    limit: 1,
    include: 2,
  });

  const [{ sys, fields }] = items;

  const data: PageData = {
    id: sys.id,
    content: fields.content ?? null,
    image: fields.image ? flattenImageAssetFields(fields.image) : null,
    background: fields.background ? flattenImageAssetFields(fields.background) : null,
    description: fields.description ?? null,
  };

  if (options?.references) {
    data.references = fields.references as PageData['references'] ?? null;
  }

  return data;
};

export default getPageContent;
