import type { Asset } from "contentful";

import type { SpeciesEntry, ContentTypeSpeciesPage } from "./types";

import { ContentTypes } from "./constants";

import { contentfulDeliveryClient } from "./contentful";
import { flattenImageAssetFields } from "./flattenAssetFields";

/**
 * Queries and returns species page entries from Contentful.
 * @returns Species page entries.
 */
const getSpecies = async (): Promise<Array<SpeciesEntry>> => {
  const { items } =
    await contentfulDeliveryClient.getEntries<ContentTypeSpeciesPage>({
      content_type: ContentTypes.SpeciesPage,
      order: ["fields.name"],
      limit: 1000,
    });

  const data = items.map(({ fields }) => ({
    name: fields.name,
    slug: fields.slug,
    order: fields.order,
    suborder: fields.suborder,
    family: fields.family,
    subfamily: fields.subfamily ?? null,
    genus: fields.genus,
    species: fields.species,
    content: fields.content,
    description: fields.description,
    image: flattenImageAssetFields(fields.image as Asset),
  }));

  return data;
};

export default getSpecies;
