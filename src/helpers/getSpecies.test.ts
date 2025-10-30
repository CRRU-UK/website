import { afterEach, describe, expect, it, vi } from "vitest";
import { contentfulDeliveryClient } from "./contentful";

import getSpecies from "./getSpecies";

vi.mock(import("./flattenAssetFields"), () => ({
  flattenImageAssetFields: vi.fn((item) => item),
  flattenVideoAssetFields: vi.fn((item) => item),
}));

vi.mock(import("./contentful"), () => ({
  contentfulDeliveryClient: {
    getEntries: vi.fn<() => void>(),
  },
}));

const mockedEntryFields = {
  name: "test name",
  slug: "test-slug",
  order: "test order",
  suborder: "test suborder",
  family: "test family",
  genus: "test genus",
  species: "test species",
  content: "test content",
  description: "test description",
  image: "test image",
};

afterEach(() => {
  vi.clearAllMocks();
});

describe(getSpecies, () => {
  it("returns species with all properties", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(() => ({
      items: [
        {
          fields: {
            ...mockedEntryFields,
            subfamily: "test subfamily",
          },
        },
      ],
    }));

    const result = await getSpecies();

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "speciesPage",
      order: ["fields.name"],
      limit: 1000,
    });

    expect(result).toStrictEqual([
      {
        ...mockedEntryFields,
        subfamily: "test subfamily",
      },
    ]);
  });

  it("returns species with missing properties", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(() => ({
      items: [
        {
          fields: mockedEntryFields,
        },
      ],
    }));

    const result = await getSpecies();

    expect(result).toStrictEqual([
      {
        ...mockedEntryFields,
        subfamily: null,
      },
    ]);
  });
});
