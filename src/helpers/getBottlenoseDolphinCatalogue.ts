import type { Entry, Asset } from 'contentful';

import type {
  CatalogueBottlenoseDolphinBasicInfo,
  CatalogueBottlenoseDolphin,
  ContentTypeCatalogueBottlenoseDolphin,
  CatalogueBottlenoseDolphinListAPIResponse,
} from './types';

import { ContentTypes, CATALOGUE_RESULTS_LIMIT } from './constants';

import { contentfulDeliveryClient } from './contentful';
import { flattenImageAssetFields } from './flattenAssetFields';

/**
 * Reduces bottlenose dolphin catalogue entry (for API responses and the `<Catalogue />` component).
 * @param entry Bottlenose dolphin catalogue Contentful entry.
 * @returns Simplified data of entry.
 */
const reduceCatalogueItem = (
  entry: Entry<ContentTypeCatalogueBottlenoseDolphin>,
): CatalogueBottlenoseDolphinBasicInfo => ({
  id: String(entry.fields.id),
  name: entry.fields?.name ? String(entry.fields.name) : null,
  slug: String(entry.fields.slug),
});

interface GetCatalogueListOptions {
  page: number,
  search?: string,
}

/**
 * Gets bottlenose dolphin catalogue entries from Contentful.
 * @param options Options.
 * @param options.page Number of entries to query.
 * @param [options.search] Text to search on `slug` field.
 * @returns Bottlenose dolphin catalogue entries.
 */
const getCatalogueList = async ({
  page,
  search,
}: GetCatalogueListOptions): Promise<CatalogueBottlenoseDolphinListAPIResponse> => {
  const query = {
    content_type: ContentTypes.CatalogueBottlenoseDolphin,
    order: ['-fields.id'],
    limit: CATALOGUE_RESULTS_LIMIT,
    skip: CATALOGUE_RESULTS_LIMIT * (page - 1),
  };

  if (search) {
    // @ts-ignore
    query['fields.slug[match]'] = search;
  }

  // @ts-ignore
  const result = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>(query);

  const items = result.items.map((entry) => reduceCatalogueItem(entry));

  return {
    meta: {
      pageSize: CATALOGUE_RESULTS_LIMIT,
      currentPage: page,
      totalPages: Math.ceil(result.total / CATALOGUE_RESULTS_LIMIT),
      totalItems: result.total,
    },
    items,
  };
};

/**
 * Gets bottlenose dolphin calf catalogue entries by mother's Contentful entry ID.
 * @param entryID Contentful entry ID.
 * @returns Array of calf catalogue entries.
 */
const getEntryCalves = async (
  entryID: string,
): Promise<Array<CatalogueBottlenoseDolphinBasicInfo>> => {
  const { items } = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>({
    content_type: ContentTypes.CatalogueBottlenoseDolphin,
    'fields.mother.sys.id': entryID,
    order: ['-fields.id'], // Order so 'current calf' is first
  });

  const data = items.map((entry) => reduceCatalogueItem(entry));

  return data;
};

/**
 * Gets bottlenose dolphin catalogue item entry from Contentful.
 * @param slug Entry `slug` field value.
 * @returns Bottlenose dolphin catalogue entry.
 */
const getCatalogueItem = async (
  slug: string,
): Promise<CatalogueBottlenoseDolphin | null> => {
  const { items } = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>({
    content_type: ContentTypes.CatalogueBottlenoseDolphin,
    limit: 1,
    'fields.slug': slug,
  });

  if (!items.length) {
    return null;
  }

  const [entry] = items;

  const calves = await getEntryCalves(entry.sys.id);

  const data = {
    entry: {
      id: entry.fields.id,
      auid: entry.fields?.auid ?? null,
      name: entry.fields?.name ?? null,
      slug: entry.fields.slug,
      description: entry.fields.description ?? null,
      firstSeen: entry.fields?.firstSeen ?? null,
      birthYear: entry.fields?.birthYear ?? null,
      age: entry.fields.age ?? null,
      sex: entry.fields.sex ?? null,
      leftDorsalFin: entry.fields?.leftDorsalFin ? flattenImageAssetFields(entry.fields.leftDorsalFin) : null,
      rightDorsalFin: entry.fields?.rightDorsalFin ? flattenImageAssetFields(entry.fields.rightDorsalFin) : null,
      otherImages: entry.fields.otherImages?.map((item) => flattenImageAssetFields(item as Asset)) ?? [],
      lastUpdated: entry.sys.updatedAt,
    },
    mother: entry.fields.mother ? reduceCatalogueItem(entry.fields.mother) : null,
    calves,
  };

  return data;
};

/**
 * Gets slug of entry by ID.
 * @param id Entry `id` field value.
 * @returns Bottlenose dolphin catalogue entry slug.
 */
const getCatalogueItemSlug = async (
  id: CatalogueBottlenoseDolphin['entry']['id'],
): Promise<CatalogueBottlenoseDolphin['entry']['slug'] | null> => {
  const { items } = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>({
    content_type: ContentTypes.CatalogueBottlenoseDolphin,
    limit: 1,
    'fields.id': id,
  });

  if (!items.length) {
    return null;
  }

  const [entry] = items;

  return entry.fields.slug;
};

export {
  getCatalogueList,
  getCatalogueItem,
  getCatalogueItemSlug,
};
