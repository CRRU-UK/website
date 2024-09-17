import { contentfulDeliveryClient } from './contentful';

import { getCatalogueList, getCatalogueItem, getCatalogueItemSlug } from './getBottlenoseDolphinCatalogue';

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

afterEach(() => {
  jest.clearAllMocks();
});

describe('getCatalogueList', () => {
  it('Returns catalogue entries', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      total: 100,
      items: mockedEntries,
    }));

    const result = await getCatalogueList({ page: 2 });

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
        auid: null,
        name: 'mocked name 1',
        slug: 'mocked-slug-1',
      }, {
        id: 'mocked-id-2',
        auid: null,
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

    await getCatalogueList({ page: 2, search: 'foo bar' });

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

describe('getCatalogueItem', () => {
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

    const result = await getCatalogueItem('mocked-slug');

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
        auid: null,
        name: null,
        slug: 'mocked-slug',
        birthYear: null,
        age: null,
        sex: 'UNKNOWN',
        totalCalves: null,
        leftDorsalFin: null,
        rightDorsalFin: null,
        otherImages: [],
        lastUpdated: 'mocked-updated-at',
      },
      mother: null,
      calves: [],
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
          auid: 'mocked-au-id',
          name: 'mocked name',
          slug: 'mocked-slug',
          birthYear: 'mocked birth year',
          age: 'mocked age',
          sex: 'mocked sex',
          totalCalves: 'mocked total calves',
          leftDorsalFin: 'mocked-left-dorsal-fin',
          rightDorsalFin: 'mocked-right-dorsal-fin',
          otherImages: ['mocked-other-image-1'],
          mother: {
            fields: {
              id: 'mocked-mother-id-1',
              auid: 'mocked-mother-auid-1',
              name: 'mocked-mother-name-1',
              slug: 'mocked-mother-slug-1',
            },
          },
        },
      }],
    }));

    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementationOnce(() => ({
      items: [{
        fields: {
          id: 'mocked-calf-id-1',
          auid: 'mocked-calf-auid-1',
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

    const result = await getCatalogueItem('mocked-slug');

    expect(result).toStrictEqual({
      entry: {
        id: 'mocked-id',
        auid: 'mocked-au-id',
        name: 'mocked name',
        slug: 'mocked-slug',
        birthYear: 'mocked birth year',
        age: 'mocked age',
        sex: 'mocked sex',
        totalCalves: 'mocked total calves',
        leftDorsalFin: 'mocked-left-dorsal-fin',
        rightDorsalFin: 'mocked-right-dorsal-fin',
        otherImages: ['mocked-other-image-1'],
        lastUpdated: 'mocked-updated-at',
      },
      mother: {
        id: 'mocked-mother-id-1',
        auid: 'mocked-mother-auid-1',
        name: 'mocked-mother-name-1',
        slug: 'mocked-mother-slug-1',
      },
      calves: [{
        id: 'mocked-calf-id-1',
        auid: 'mocked-calf-auid-1',
        name: 'mocked-calf-name-1',
        slug: 'mocked-calf-slug-1',
      }, {
        id: 'mocked-calf-id-2',
        auid: null,
        name: null,
        slug: 'mocked-calf-slug-2',
      }],
    });
  });

  it('Returns null for no catalogue item', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      items: [],
    }));

    const result = await getCatalogueItem('mocked-slug');

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);

    expect(result).toBe(null);
  });
});

describe('getCatalogueItemSlug', () => {
  it('Gets slug from entry by ID', async () => {
    (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
      items: [{
        fields: {
          slug: 'mocked-slug',
        },
      }],
    }));

    const result = await getCatalogueItemSlug('mocked-id');

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

    const result = await getCatalogueItemSlug('mocked-id');

    expect(result).toBe(null);
  });
});
