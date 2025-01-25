import type { Asset, AssetFile } from "contentful";

import type { FlattenedImage, FlattenedVideo } from "./types";

/**
 * Flattens a Contentful image asset field (in order to reduce page size).
 * @param field Contentful asset field.
 * @returns Flattened image object.
 */
const flattenImageAssetFields = (field: Asset): FlattenedImage => ({
  url: `https:${(field.fields.file as AssetFile).url}`,
  width: (field.fields.file as AssetFile).details.image!.width,
  height: (field.fields.file as AssetFile).details.image!.height,
  alt: (field.fields.description as string) || null,
});

/**
 * Flattens a Contentful video asset field (in order to reduce page size).
 * @param field Contentful asset field.
 * @returns Flattened video object.
 */
const flattenVideoAssetFields = (field: Asset): FlattenedVideo => ({
  url: `https:${(field.fields.file as AssetFile).url}`,
  type: (field.fields.file as AssetFile).contentType,
});

export { flattenImageAssetFields, flattenVideoAssetFields };
