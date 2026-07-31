import type { Asset, Entry } from "contentful";
import buildFamilyForest from "./buildFamilyForest";
import { CATALOGUE_RESULTS_LIMIT, Catalogues, ContentTypes } from "./constants";
import { contentfulDeliveryClient } from "./contentful";
import { flattenImageAssetFields } from "./flattenAssetFields";
import type {
  CatalogueAPIResponse,
  CatalogueBasicInfo,
  CatalogueBottlenoseDolphin,
  CatalogueFamilyEntry,
  CatalogueFamilyNode,
  CatalogueMinkeWhale,
  ContentTypeCatalogueBottlenoseDolphin,
  ContentTypeCatalogueMinkeWhale,
} from "./types";

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
  page: number;
  search?: string;
}

/**
 * Gets catalogue entries from Contentful.
 * @param catalogue Catalogue type.
 * @param options Options.
 * @param options.page Number of entries to query.
 * @param [options.search] Text to search on `slug` field.
 * @returns Catalogue entries.
 */
const getCatalogueList = async (
  catalogue: Catalogues,
  { page, search }: GetCatalogueListOptions,
): Promise<CatalogueAPIResponse | null> => {
  const query = {
    order: ["fields.id"],
    limit: CATALOGUE_RESULTS_LIMIT,
    skip: CATALOGUE_RESULTS_LIMIT * (page - 1),
  };

  if (search) {
    // @ts-expect-error TBA
    query.query = search;
  }

  let result: Awaited<
    ReturnType<
      | typeof contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>
      | typeof contentfulDeliveryClient.getEntries<ContentTypeCatalogueMinkeWhale>
    >
  >;

  if (catalogue === Catalogues.BottlenoseDolphin) {
    result = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>({
      content_type: ContentTypes.CatalogueBottlenoseDolphin,
      ...query,
    });
  } else if (catalogue === Catalogues.MinkeWhale) {
    result = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueMinkeWhale>({
      content_type: ContentTypes.CatalogueMinkeWhale,
      ...query,
    });
  } else {
    throw new Error(`Unknown catalogue type: ${catalogue}`);
  }

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
const getBottlenoseEntryCalves = async (entryID: string): Promise<Array<CatalogueBasicInfo>> => {
  const { items } =
    await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>({
      content_type: ContentTypes.CatalogueBottlenoseDolphin,
      "fields.mother.sys.id": entryID,
      order: ["-fields.id"], // Order so 'current calf' is first
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
  const { items } =
    await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>({
      content_type: ContentTypes.CatalogueBottlenoseDolphin,
      limit: 1,
      "fields.slug": slug,
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
      sex: entry.fields?.sex ?? "UNKNOWN",
      totalRecaptures: entry.fields?.totalRecaptures ?? null,
      yearsRecaptured: entry.fields?.yearsRecaptured ?? null,
      totalCalves: entry.fields.totalCalves ?? null,
      leftDorsalFin: entry.fields?.leftDorsalFin
        ? flattenImageAssetFields(entry.fields.leftDorsalFin)
        : null,
      rightDorsalFin: entry.fields?.rightDorsalFin
        ? flattenImageAssetFields(entry.fields.rightDorsalFin)
        : null,
      otherImages:
        entry.fields.otherImages?.map((item) => flattenImageAssetFields(item as Asset)) ?? [],
      lastUpdated: entry.sys.updatedAt,
    },
    mother: entry.fields.mother ? reduceCatalogueItem(entry.fields.mother) : null,
    calves,
    previous: entry.fields.previousEntry ? reduceCatalogueItem(entry.fields.previousEntry) : null,
    next: entry.fields.nextEntry ? reduceCatalogueItem(entry.fields.nextEntry) : null,
  };

  return data;
};

/**
 * Gets every bottlenose dolphin family tree from Contentful. Queries every entry rather than
 * filtering on `fields.mother[exists]`: `select` does not apply to the `includes` block, so
 * filtering would pull in unreduced mother entries for no benefit. With every entry in `items`
 * there is nothing to resolve from `includes` at all.
 * @returns Family trees, ordered by the `id` field of their root.
 */
const getBottlenoseDolphinFamilyForest = async (): Promise<Array<CatalogueFamilyNode>> => {
  const entries: Array<CatalogueFamilyEntry> = [];

  let skip = 0;
  let total = 0;

  do {
    const result = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>(
      {
        content_type: ContentTypes.CatalogueBottlenoseDolphin,
        select: [
          "sys.id",
          "fields.id",
          "fields.reference",
          "fields.name",
          "fields.slug",
          "fields.mother",
        ],
        order: ["fields.id", "sys.id"], // `sys.id` breaks ties so paging cannot skip or repeat
        limit: 1000, // Contentful Delivery API maximum
        skip,
      },
    );

    total = result.total;
    skip += result.items.length;

    for (const entry of result.items) {
      entries.push({
        key: entry.sys.id,
        motherKey: entry.fields.mother?.sys.id ?? null,
        info: reduceCatalogueItem(entry),
      });
    }

    // Defensive: never spin if the API returns an empty page
    if (!result.items.length) {
      break;
    }
  } while (skip < total);

  return buildFamilyForest(entries);
};

/**
 * Gets slug of bottlenose dolphin entry by ID.
 * @param id Entry `id` field value.
 * @returns Bottlenose dolphin catalogue entry slug.
 */
const getBottlenoseDolphinItemEntrySlug = async (
  id: CatalogueBottlenoseDolphin["entry"]["id"],
): Promise<CatalogueBottlenoseDolphin["entry"]["slug"] | null> => {
  const { items } =
    await contentfulDeliveryClient.getEntries<ContentTypeCatalogueBottlenoseDolphin>({
      content_type: ContentTypes.CatalogueBottlenoseDolphin,
      limit: 1,
      "fields.id": id,
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
const getMinkeWhaleCatalogueItem = async (slug: string): Promise<CatalogueMinkeWhale | null> => {
  const { items } = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueMinkeWhale>({
    content_type: ContentTypes.CatalogueMinkeWhale,
    limit: 1,
    "fields.slug": slug,
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
      leftDorsalFin: entry.fields?.leftDorsalFin
        ? flattenImageAssetFields(entry.fields.leftDorsalFin)
        : null,
      rightDorsalFin: entry.fields?.rightDorsalFin
        ? flattenImageAssetFields(entry.fields.rightDorsalFin)
        : null,
      otherImages:
        entry.fields.otherImages?.map((item) => flattenImageAssetFields(item as Asset)) ?? [],
      lastUpdated: entry.sys.updatedAt,
    },
    previous: entry.fields.previousEntry ? reduceCatalogueItem(entry.fields.previousEntry) : null,
    next: entry.fields.nextEntry ? reduceCatalogueItem(entry.fields.nextEntry) : null,
  };

  return data;
};

/**
 * Gets slug of minke whale entry by ID.
 * @param id Entry `id` field value.
 * @returns Bottlenose dolphin catalogue entry slug.
 */
const getMinkeWhaleItemEntrySlug = async (
  id: CatalogueMinkeWhale["entry"]["id"],
): Promise<CatalogueMinkeWhale["entry"]["slug"] | null> => {
  const { items } = await contentfulDeliveryClient.getEntries<ContentTypeCatalogueMinkeWhale>({
    content_type: ContentTypes.CatalogueMinkeWhale,
    limit: 1,
    "fields.id": id,
  });

  if (!items.length) {
    return null;
  }

  const [entry] = items;

  return entry.fields.slug;
};

export {
  getBottlenoseDolphinCatalogueItem,
  getBottlenoseDolphinFamilyForest,
  getBottlenoseDolphinItemEntrySlug,
  getCatalogueList,
  getMinkeWhaleCatalogueItem,
  getMinkeWhaleItemEntrySlug,
};
