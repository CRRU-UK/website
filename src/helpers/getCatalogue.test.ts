import { afterEach, describe, expect, it, vi } from "vitest";
import { contentfulDeliveryClient } from "./contentful";

import {
  getBottlenoseDolphinCatalogueItem,
  getBottlenoseDolphinItemEntrySlug,
  getCatalogueList,
  getMinkeWhaleCatalogueItem,
  getMinkeWhaleItemEntrySlug,
} from "./getCatalogue";

vi.mock("./flattenAssetFields", () => ({
  flattenImageAssetFields: vi.fn((item) => item),
  flattenVideoAssetFields: vi.fn((item) => item),
}));

vi.mock("./contentful", () => ({
  contentfulDeliveryClient: {
    getEntries: vi.fn<() => void>(),
  },
}));

const mockedEntries = [
  {
    fields: {
      id: "mocked-id-1",
      name: "mocked name 1",
      slug: "mocked-slug-1",
    },
  },
  {
    fields: {
      id: "mocked-id-2",
      name: "mocked name 2",
      slug: "mocked-slug-2",
      otherImages: ["mocked image 2"],
    },
  },
];

const mockedPreviousEntryFields = {
  id: "mocked-previous-entry-id",
  reference: "mocked-previous-entry-reference",
  name: "mocked-previous-entry-name",
  slug: "mocked-previous-entry-slug",
};

const mockedNextEntryFields = {
  id: "mocked-next-entry-id",
  reference: "mocked-next-entry-reference",
  name: "mocked-next-entry-name",
  slug: "mocked-next-entry-slug",
};

describe(getCatalogueList, () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ["bottlenose-dolphin", "catalogueBottlenoseDolphin"],
    ["minke-whale", "catalogueMinkeWhale"],
  ])("returns catalogue entries (%p)", async (catalogue, contentType) => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () =>
        ({
          total: 100,
          items: mockedEntries,
        }) as any,
    );

    const result = await getCatalogueList(
      // @ts-expect-error String of enum value
      catalogue,
      { page: 2 },
    );

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: contentType,
      order: ["fields.id"],
      limit: 30,
      skip: 30,
    });

    expect(result).toStrictEqual({
      meta: {
        currentPage: 2,
        pageSize: 30,
        totalItems: 100,
        totalPages: 4,
      },
      items: [
        {
          id: "mocked-id-1",
          reference: null,
          name: "mocked name 1",
          slug: "mocked-slug-1",
        },
        {
          id: "mocked-id-2",
          reference: null,
          name: "mocked name 2",
          slug: "mocked-slug-2",
        },
      ],
    });
  });

  it("returns catalogue entries with search", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () =>
        ({
          total: 100,
          items: mockedEntries,
        }) as any,
    );

    await getCatalogueList(
      // @ts-expect-error String of enum value
      "bottlenose-dolphin",
      { page: 2, search: "foo bar" },
    );

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "catalogueBottlenoseDolphin",
      order: ["fields.id"],
      query: "foo bar",
      limit: 30,
      skip: 30,
    });
  });

  it("throws error on invalid catalogue type", async () => {
    await expect(
      getCatalogueList(
        // @ts-expect-error Invalid catalogue type
        "foo-bar",
        { page: 1 },
      ),
    ).rejects.toThrow("Unknown catalogue type: foo-bar");

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(0);
  });
});

describe(getBottlenoseDolphinCatalogueItem, () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("gets catalogue item with default fields", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementationOnce(
      () =>
        ({
          items: [
            {
              sys: {
                id: "mocked-entry-id",
                updatedAt: "mocked-updated-at",
              },
              fields: {
                id: "mocked-id",
                slug: "mocked-slug",
              },
            },
          ],
        }) as any,
    );

    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementationOnce(
      () =>
        ({
          items: [],
        }) as any,
    );

    const result = await getBottlenoseDolphinCatalogueItem("mocked-slug");

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(2);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "catalogueBottlenoseDolphin",
      limit: 1,
      "fields.slug": "mocked-slug",
    });
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(2, {
      content_type: "catalogueBottlenoseDolphin",
      "fields.mother.sys.id": "mocked-entry-id",
      order: ["-fields.id"],
    });

    expect(result).toStrictEqual({
      entry: {
        id: "mocked-id",
        reference: null,
        name: null,
        slug: "mocked-slug",
        birthYear: null,
        sex: "UNKNOWN",
        totalRecaptures: null,
        yearsRecaptured: null,
        totalCalves: null,
        leftDorsalFin: null,
        rightDorsalFin: null,
        otherImages: [],
        lastUpdated: "mocked-updated-at",
      },
      mother: null,
      calves: [],
      previous: null,
      next: null,
    });
  });

  it("gets catalogue item with all fields", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementationOnce(
      () =>
        ({
          items: [
            {
              sys: {
                id: "mocked-entry-id",
                updatedAt: "mocked-updated-at",
              },
              fields: {
                id: "mocked-id",
                reference: "mocked-au-id",
                name: "mocked name",
                slug: "mocked-slug",
                birthYear: "mocked birth year",
                sex: "mocked sex",
                totalRecaptures: 5,
                yearsRecaptured: ["mocked recapture 1"],
                totalCalves: "mocked total calves",
                leftDorsalFin: "mocked-left-dorsal-fin",
                rightDorsalFin: "mocked-right-dorsal-fin",
                otherImages: ["mocked-other-image-1"],
                mother: {
                  fields: {
                    id: "mocked-mother-id-1",
                    reference: "mocked-mother-reference-1",
                    name: "mocked-mother-name-1",
                    slug: "mocked-mother-slug-1",
                  },
                },
                previousEntry: { fields: mockedPreviousEntryFields },
                nextEntry: { fields: mockedNextEntryFields },
              },
            },
          ],
        }) as any,
    );

    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementationOnce(
      () =>
        ({
          items: [
            {
              fields: {
                id: "mocked-calf-id-1",
                reference: "mocked-calf-reference-1",
                name: "mocked-calf-name-1",
                slug: "mocked-calf-slug-1",
              },
            },
            {
              fields: {
                id: "mocked-calf-id-2",
                slug: "mocked-calf-slug-2",
              },
            },
          ],
        }) as any,
    );

    const result = await getBottlenoseDolphinCatalogueItem("mocked-slug");

    expect(result).toStrictEqual({
      entry: {
        id: "mocked-id",
        reference: "mocked-au-id",
        name: "mocked name",
        slug: "mocked-slug",
        birthYear: "mocked birth year",
        sex: "mocked sex",
        totalRecaptures: 5,
        yearsRecaptured: ["mocked recapture 1"],
        totalCalves: "mocked total calves",
        leftDorsalFin: "mocked-left-dorsal-fin",
        rightDorsalFin: "mocked-right-dorsal-fin",
        otherImages: ["mocked-other-image-1"],
        lastUpdated: "mocked-updated-at",
      },
      mother: {
        id: "mocked-mother-id-1",
        reference: "mocked-mother-reference-1",
        name: "mocked-mother-name-1",
        slug: "mocked-mother-slug-1",
      },
      calves: [
        {
          id: "mocked-calf-id-1",
          reference: "mocked-calf-reference-1",
          name: "mocked-calf-name-1",
          slug: "mocked-calf-slug-1",
        },
        {
          id: "mocked-calf-id-2",
          reference: null,
          name: null,
          slug: "mocked-calf-slug-2",
        },
      ],
      previous: mockedPreviousEntryFields,
      next: mockedNextEntryFields,
    });
  });

  it("returns null for no catalogue item", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () =>
        ({
          items: [],
        }) as any,
    );

    const result = await getBottlenoseDolphinCatalogueItem("mocked-slug");

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);

    expect(result).toBeNull();
  });
});

describe(getBottlenoseDolphinItemEntrySlug, () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("gets slug from entry by ID", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () =>
        ({
          items: [
            {
              fields: {
                slug: "mocked-slug",
              },
            },
          ],
        }) as any,
    );

    const result = await getBottlenoseDolphinItemEntrySlug("mocked-id");

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "catalogueBottlenoseDolphin",
      limit: 1,
      "fields.id": "mocked-id",
    });

    expect(result).toBe("mocked-slug");
  });

  it("handles no matching entries", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () =>
        ({
          items: [],
        }) as any,
    );

    const result = await getBottlenoseDolphinItemEntrySlug("mocked-id");

    expect(result).toBeNull();
  });
});

describe(getMinkeWhaleCatalogueItem, () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("gets catalogue item with default fields", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementationOnce(
      () =>
        ({
          items: [
            {
              sys: {
                id: "mocked-entry-id",
                updatedAt: "mocked-updated-at",
              },
              fields: {
                id: "mocked-id",
                slug: "mocked-slug",
              },
            },
          ],
        }) as any,
    );

    const result = await getMinkeWhaleCatalogueItem("mocked-slug");

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "catalogueMinkeWhale",
      limit: 1,
      "fields.slug": "mocked-slug",
    });

    expect(result).toStrictEqual({
      entry: {
        id: "mocked-id",
        reference: null,
        name: null,
        slug: "mocked-slug",
        totalRecaptures: null,
        yearsRecaptured: null,
        leftDorsalFin: null,
        rightDorsalFin: null,
        lastUpdated: "mocked-updated-at",
      },
      previous: null,
      next: null,
    });
  });

  it("gets catalogue item with all fields", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementationOnce(
      () =>
        ({
          items: [
            {
              sys: {
                id: "mocked-entry-id",
                updatedAt: "mocked-updated-at",
              },
              fields: {
                id: "mocked-id",
                reference: "mocked-au-id",
                name: "mocked name",
                slug: "mocked-slug",
                totalRecaptures: 5,
                yearsRecaptured: ["mocked recapture 1"],
                leftDorsalFin: "mocked-left-dorsal-fin",
                rightDorsalFin: "mocked-right-dorsal-fin",
                previousEntry: { fields: mockedPreviousEntryFields },
                nextEntry: { fields: mockedNextEntryFields },
              },
            },
          ],
        }) as any,
    );

    const result = await getMinkeWhaleCatalogueItem("mocked-slug");

    expect(result).toStrictEqual({
      entry: {
        id: "mocked-id",
        reference: "mocked-au-id",
        name: "mocked name",
        slug: "mocked-slug",
        totalRecaptures: 5,
        yearsRecaptured: ["mocked recapture 1"],
        leftDorsalFin: "mocked-left-dorsal-fin",
        rightDorsalFin: "mocked-right-dorsal-fin",
        lastUpdated: "mocked-updated-at",
      },
      previous: mockedPreviousEntryFields,
      next: mockedNextEntryFields,
    });
  });

  it("returns null for no catalogue item", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () =>
        ({
          items: [],
        }) as any,
    );

    const result = await getMinkeWhaleCatalogueItem("mocked-slug");

    expect(result).toBeNull();
  });
});

describe(getMinkeWhaleItemEntrySlug, () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("gets slug from entry by ID", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () =>
        ({
          items: [
            {
              fields: {
                slug: "mocked-slug",
              },
            },
          ],
        }) as any,
    );

    const result = await getMinkeWhaleItemEntrySlug("mocked-id");

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "catalogueMinkeWhale",
      limit: 1,
      "fields.id": "mocked-id",
    });

    expect(result).toBe("mocked-slug");
  });

  it("handles no matching entries", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () =>
        ({
          items: [],
        }) as any,
    );

    const result = await getMinkeWhaleItemEntrySlug("mocked-id");

    expect(result).toBeNull();
  });
});
