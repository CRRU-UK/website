import type { Entry, Asset } from 'contentful';

import type {
  CatalogueAPIResponse,
  CatalogueBasicInfo,
  CatalogueBottlenoseDolphin,
  ContentTypeCatalogueBottlenoseDolphin,
  CatalogueMinkeWhale,
  ContentTypeCatalogueMinkeWhale,
} from './types';

import { Catalogues, ContentTypes, CATALOGUE_RESULTS_LIMIT } from './constants';

import { contentfulDeliveryClient } from './contentful';
import { flattenImageAssetFields } from './flattenAssetFields';

/**
 * Reduces bottlenose dolphin catalogue entry.
 * @param entry Bottlenose dolphin catalogue Contentful entry.
 * @returns Simplified data of entry.
 */
const reduceCatalogueItem = (
  entry: Entry<ContentTypeCatalogueBottlenoseDolphin | ContentTypeCatalogueMinkeWhale>,
): CatalogueBasicInfo => ({
  id: String(entry.fields.id),
  reference: entry.fields?.reference ? String(entry.fields.reference) : null,
  name: entry.fields?.name ? String(entry.fields.name) : null,
  slug: String(entry.fields.slug),
});

interface GetCatalogueListOptions {
  page: number,
  search?: string,
}

/**
 * Gets catalogue entries from Contentful.
 * @param catalogue Catalogue type.
 * @param options Options.
 * @param options.page Number of entries to query.
 * @param [options.search] Text to search on `slug` field.
 * @returns Catalogue entries.
 */
const getCatalogueList = async (catalogue: Catalogues, {
  page,
  search,
}: GetCatalogueListOptions): Promise<CatalogueAPIResponse | null> => {
  const query = {
    order: ['fields.id'],
    limit: CATALOGUE_RESULTS_LIMIT,
    skip: CATALOGUE_RESULTS_LIMIT * (page - 1),
  };

  if (search) {
    // @ts-expect-error TBA
    query.query = search;
  }

  let result;

  if (catalogue === Catalogues.BottlenoseDolphin) {
    result = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>({
      content_type: ContentTypes.CatalogueBottlenoseDolphin,
      ...query,
    });
  }

  if (catalogue === Catalogues.MinkeWhale) {
    result = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueMinkeWhale>({
      content_type: ContentTypes.CatalogueMinkeWhale,
      ...query,
    });
  }

  const items = result!.items.map((entry) => reduceCatalogueItem(entry));

  return {
    meta: {
      pageSize: CATALOGUE_RESULTS_LIMIT,
      currentPage: page,
      totalPages: Math.ceil(result!.total / CATALOGUE_RESULTS_LIMIT),
      totalItems: result!.total,
    },
    items,
  };
};

/**
 * Gets bottlenose dolphin calf catalogue entries by mother's Contentful entry ID.
 * @param entryID Contentful entry ID.
 * @returns Array of calf catalogue entries.
 */
const getBottlenoseEntryCalves = async (
  entryID: string,
): Promise<Array<CatalogueBasicInfo>> => {
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
const getBottlenoseDolphinCatalogueItem = async (
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

  const calves = await getBottlenoseEntryCalves(entry.sys.id);

  const data = {
    entry: {
      id: entry.fields.id,
      reference: entry.fields?.reference ?? null,
      name: entry.fields?.name ?? null,
      slug: entry.fields.slug,
      birthYear: entry.fields?.birthYear ?? null,
      sex: entry.fields?.sex ?? 'UNKNOWN',
      totalRecaptures: entry.fields?.totalRecaptures ?? null,
      yearsRecaptured: entry.fields?.yearsRecaptured ?? null,
      totalCalves: entry.fields.totalCalves ?? null,
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
 * Gets slug of bottlenose dolphin entry by ID.
 * @param id Entry `id` field value.
 * @returns Bottlenose dolphin catalogue entry slug.
 */
const getBottlenoseDolphinItemEntrySlug = async (
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

/**
 * Gets minke whale catalogue item entry from Contentful.
 * @param slug Entry `slug` field value.
 * @returns Minke whale catalogue entry.
 */
const getMinkeWhaleCatalogueItem = async (
  slug: string,
): Promise<CatalogueMinkeWhale | null> => {
  const { items } = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueMinkeWhale>({
    content_type: ContentTypes.CatalogueMinkeWhale,
    limit: 1,
    'fields.slug': slug,
  });

  if (!items.length) {
    return null;
  }

  const [entry] = items;

  const data = {
    entry: {
      id: entry.fields.id,
      reference: entry.fields?.reference ?? null,
      name: entry.fields?.name ?? null,
      slug: entry.fields.slug,
      totalRecaptures: entry.fields?.totalRecaptures ?? null,
      yearsRecaptured: entry.fields?.yearsRecaptured ?? null,
      leftDorsalFin: entry.fields?.leftDorsalFin ? flattenImageAssetFields(entry.fields.leftDorsalFin) : null,
      rightDorsalFin: entry.fields?.rightDorsalFin ? flattenImageAssetFields(entry.fields.rightDorsalFin) : null,
      lastUpdated: entry.sys.updatedAt,
    },
  };

  return data;
};

/**
 * Gets slug of minke whale entry by ID.
 * @param id Entry `id` field value.
 * @returns Bottlenose dolphin catalogue entry slug.
 */
const getMinkeWhaleItemEntrySlug = async (
  id: CatalogueMinkeWhale['entry']['id'],
): Promise<CatalogueMinkeWhale['entry']['slug'] | null> => {
  const { items } = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueMinkeWhale>({
    content_type: ContentTypes.CatalogueMinkeWhale,
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
  getBottlenoseDolphinCatalogueItem,
  getBottlenoseDolphinItemEntrySlug,
  getMinkeWhaleCatalogueItem,
  getMinkeWhaleItemEntrySlug,
};
