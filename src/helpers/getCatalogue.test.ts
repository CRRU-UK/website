import { contentfulDeliveryClient } from './contentful';

import {
  getCatalogueList,
  getBottlenoseDolphinCatalogueItem,
  getBottlenoseDolphinItemEntrySlug,
  getMinkeWhaleCatalogueItem,
  getMinkeWhaleItemEntrySlug,
} from './getCatalogue';

jest.mock('./flattenAssetFields', () => ({
  flattenImageAssetFields: jest.fn((item) => item),
  flattenVideoAssetFields: jest.fn((item) => item),
}));

jest.mock('./contentful', () => ({
  contentfulDeliveryClient: {
    getEntries: jest.fn(),
  },
}));

const mockedEntries = [{
  fields: {
    id: 'mocked-id-1',
    name: 'mocked name 1',
    slug: 'mocked-slug-1',
  },
}, {
  fields: {
    id: 'mocked-id-2',
    name: 'mocked name 2',
    slug: 'mocked-slug-2',
    otherImages: ['mocked image 2'],
  },
}];

const mockedPreviousEntryFields = {
  id: 'mocked-previous-entry-id',
  reference: 'mocked-previous-entry-reference',
  name: 'mocked-previous-entry-name',
  slug: 'mocked-previous-entry-slug',
};

const mockedNextEntryFields = {
  id: 'mocked-next-entry-id',
  reference: 'mocked-next-entry-reference',
  name: 'mocked-next-entry-name',
  slug: 'mocked-next-entry-slug',
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('getCatalogueList', () => {
  it('Returns catalogue entries', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      total: 100,
      items: mockedEntries,
    }));

    const result = await getCatalogueList(
      // @ts-expect-error String of enum value
      'bottlenose-dolphin',
      { page: 2 },
    );

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: 'catalogueBottlenoseDolphin',
      order: ['fields.id'],
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
      items: [{
        id: 'mocked-id-1',
        reference: null,
        name: 'mocked name 1',
        slug: 'mocked-slug-1',
      }, {
        id: 'mocked-id-2',
        reference: null,
        name: 'mocked name 2',
        slug: 'mocked-slug-2',
      }],
    });
  });

  it('Returns catalogue entries with search', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      total: 100,
      items: mockedEntries,
    }));

    await getCatalogueList(
      // @ts-expect-error String of enum value
      'bottlenose-dolphin',
      { page: 2, search: 'foo bar' },
    );

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: 'catalogueBottlenoseDolphin',
      order: ['fields.id'],
      'query': 'foo bar',
      limit: 30,
      skip: 30,
    });
  });
});

describe('getBottlenoseDolphinCatalogueItem', () => {
  it('Gets catalogue item with default fields', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementationOnce(() => ({
      items: [{
        sys: {
          id: 'mocked-entry-id',
          updatedAt: 'mocked-updated-at',
        },
        fields: {
          id: 'mocked-id',
          slug: 'mocked-slug',
        },
      }],
    }));

    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementationOnce(() => ({
      items: [],
    }));

    const result = await getBottlenoseDolphinCatalogueItem('mocked-slug');

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(2);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: 'catalogueBottlenoseDolphin',
      limit: 1,
      'fields.slug': 'mocked-slug',
    });
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(2, {
      content_type: 'catalogueBottlenoseDolphin',
      'fields.mother.sys.id': 'mocked-entry-id',
      order: ['-fields.id'],
    });

    expect(result).toStrictEqual({
      entry: {
        id: 'mocked-id',
        reference: null,
        name: null,
        slug: 'mocked-slug',
        birthYear: null,
        sex: 'UNKNOWN',
        totalRecaptures: null,
        yearsRecaptured: null,
        totalCalves: null,
        leftDorsalFin: null,
        rightDorsalFin: null,
        otherImages: [],
        lastUpdated: 'mocked-updated-at',
      },
      mother: null,
      calves: [],
      previous: null,
      next: null,
    });
  });

  it('Gets catalogue item with all fields', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementationOnce(() => ({
      items: [{
        sys: {
          id: 'mocked-entry-id',
          updatedAt: 'mocked-updated-at',
        },
        fields: {
          id: 'mocked-id',
          reference: 'mocked-au-id',
          name: 'mocked name',
          slug: 'mocked-slug',
          birthYear: 'mocked birth year',
          sex: 'mocked sex',
          totalRecaptures: 5,
          yearsRecaptured: ['mocked recapture 1'],
          totalCalves: 'mocked total calves',
          leftDorsalFin: 'mocked-left-dorsal-fin',
          rightDorsalFin: 'mocked-right-dorsal-fin',
          otherImages: ['mocked-other-image-1'],
          mother: {
            fields: {
              id: 'mocked-mother-id-1',
              reference: 'mocked-mother-reference-1',
              name: 'mocked-mother-name-1',
              slug: 'mocked-mother-slug-1',
            },
          },
          previousEntry: { fields: mockedPreviousEntryFields },
          nextEntry: { fields: mockedNextEntryFields },
        },
      }],
    }));

    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementationOnce(() => ({
      items: [{
        fields: {
          id: 'mocked-calf-id-1',
          reference: 'mocked-calf-reference-1',
          name: 'mocked-calf-name-1',
          slug: 'mocked-calf-slug-1',
        },
      }, {
        fields: {
          id: 'mocked-calf-id-2',
          slug: 'mocked-calf-slug-2',
        },
      }],
    }));

    const result = await getBottlenoseDolphinCatalogueItem('mocked-slug');

    expect(result).toStrictEqual({
      entry: {
        id: 'mocked-id',
        reference: 'mocked-au-id',
        name: 'mocked name',
        slug: 'mocked-slug',
        birthYear: 'mocked birth year',
        sex: 'mocked sex',
        totalRecaptures: 5,
        yearsRecaptured: ['mocked recapture 1'],
        totalCalves: 'mocked total calves',
        leftDorsalFin: 'mocked-left-dorsal-fin',
        rightDorsalFin: 'mocked-right-dorsal-fin',
        otherImages: ['mocked-other-image-1'],
        lastUpdated: 'mocked-updated-at',
      },
      mother: {
        id: 'mocked-mother-id-1',
        reference: 'mocked-mother-reference-1',
        name: 'mocked-mother-name-1',
        slug: 'mocked-mother-slug-1',
      },
      calves: [{
        id: 'mocked-calf-id-1',
        reference: 'mocked-calf-reference-1',
        name: 'mocked-calf-name-1',
        slug: 'mocked-calf-slug-1',
      }, {
        id: 'mocked-calf-id-2',
        reference: null,
        name: null,
        slug: 'mocked-calf-slug-2',
      }],
      previous: mockedPreviousEntryFields,
      next: mockedNextEntryFields,
    });
  });

  it('Returns null for no catalogue item', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      items: [],
    }));

    const result = await getBottlenoseDolphinCatalogueItem('mocked-slug');

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);

    expect(result).toBe(null);
  });
});

describe('getBottlenoseDolphinItemEntrySlug', () => {
  it('Gets slug from entry by ID', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      items: [{
        fields: {
          slug: 'mocked-slug',
        },
      }],
    }));

    const result = await getBottlenoseDolphinItemEntrySlug('mocked-id');

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: 'catalogueBottlenoseDolphin',
      limit: 1,
      'fields.id': 'mocked-id',
    });

    expect(result).toBe('mocked-slug');
  });

  it('Handles no matching entries', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      items: [],
    }));

    const result = await getBottlenoseDolphinItemEntrySlug('mocked-id');

    expect(result).toBe(null);
  });
});

describe('getMinkeWhaleCatalogueItem', () => {
  it('Gets catalogue item with default fields', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementationOnce(() => ({
      items: [{
        sys: {
          id: 'mocked-entry-id',
          updatedAt: 'mocked-updated-at',
        },
        fields: {
          id: 'mocked-id',
          slug: 'mocked-slug',
        },
      }],
    }));

    const result = await getMinkeWhaleCatalogueItem('mocked-slug');

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: 'catalogueMinkeWhale',
      limit: 1,
      'fields.slug': 'mocked-slug',
    });

    expect(result).toStrictEqual({
      entry: {
        id: 'mocked-id',
        reference: null,
        name: null,
        slug: 'mocked-slug',
        totalRecaptures: null,
        yearsRecaptured: null,
        leftDorsalFin: null,
        rightDorsalFin: null,
        lastUpdated: 'mocked-updated-at',
      },
      previous: null,
      next: null,
    });
  });

  it('Gets catalogue item with all fields', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementationOnce(() => ({
      items: [{
        sys: {
          id: 'mocked-entry-id',
          updatedAt: 'mocked-updated-at',
        },
        fields: {
          id: 'mocked-id',
          reference: 'mocked-au-id',
          name: 'mocked name',
          slug: 'mocked-slug',
          totalRecaptures: 5,
          yearsRecaptured: ['mocked recapture 1'],
          leftDorsalFin: 'mocked-left-dorsal-fin',
          rightDorsalFin: 'mocked-right-dorsal-fin',
          previousEntry: { fields: mockedPreviousEntryFields },
          nextEntry: { fields: mockedNextEntryFields },
        },
      }],
    }));

    const result = await getMinkeWhaleCatalogueItem('mocked-slug');

    expect(result).toStrictEqual({
      entry: {
        id: 'mocked-id',
        reference: 'mocked-au-id',
        name: 'mocked name',
        slug: 'mocked-slug',
        totalRecaptures: 5,
        yearsRecaptured: ['mocked recapture 1'],
        leftDorsalFin: 'mocked-left-dorsal-fin',
        rightDorsalFin: 'mocked-right-dorsal-fin',
        lastUpdated: 'mocked-updated-at',
      },
      previous: mockedPreviousEntryFields,
      next: mockedNextEntryFields,
    });
  });

  it('Returns null for no catalogue item', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      items: [],
    }));

    const result = await getBottlenoseDolphinCatalogueItem('mocked-slug');

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);

    expect(result).toBe(null);
  });
});

describe('getMinkeWhaleItemEntrySlug', () => {
  it('Gets slug from entry by ID', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      items: [{
        fields: {
          slug: 'mocked-slug',
        },
      }],
    }));

    const result = await getMinkeWhaleItemEntrySlug('mocked-id');

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: 'catalogueMinkeWhale',
      limit: 1,
      'fields.id': 'mocked-id',
    });

    expect(result).toBe('mocked-slug');
  });

  it('Handles no matching entries', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      items: [],
    }));

    const result = await getMinkeWhaleItemEntrySlug('mocked-id');

    expect(result).toBe(null);
  });
});
