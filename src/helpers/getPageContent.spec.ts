import { contentfulDeliveryClient, contentfulPreviewClient } from './contentful';

import getPageContent from './getPageContent';

jest.mock('./flattenAssetFields', () => ({
  flattenImageAssetFields: jest.fn((item) => item),
  flattenVideoAssetFields: jest.fn((item) => item),
}));

jest.mock('./contentful', () => ({
  contentfulDeliveryClient: {
    getEntries: jest.fn(),
  },
  contentfulPreviewClient: {
    getEntries: jest.fn(),
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('Returns page content entry with defaults', async () => {
  (contentfulDeliveryClient.getEntries as jest.Mock)
    .mockImplementation(() => ({
      items: [{
        sys: { id: 'test-id' },
        fields: {
          content: 'test content',
          image: 'test image',
          background: 'test background',
          description: 'test description',
          references: ['test-reference-1', 'test-reference-2'],
        },
      }],
    }));

  const result = await getPageContent('/mocked/path');

  expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
  expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
    content_type: 'page',
    'fields.path': '/mocked/path',
    limit: 1,
    include: 2,
  });

  expect(contentfulPreviewClient.getEntries).toHaveBeenCalledTimes(0);

  expect(result).toStrictEqual({
    id: 'test-id',
    content: 'test content',
    image: 'test image',
    background: 'test background',
    description: 'test description',
  });
});

it('Returns page content entry with options', async () => {
  (contentfulDeliveryClient.getEntries as jest.Mock)
    .mockImplementation(() => ({
      items: [{
        sys: { id: 'test-id' },
        fields: {
          content: 'test content',
          image: 'test image',
          background: 'test background',
          description: 'test description',
          references: ['test-reference-1', 'test-reference-2'],
        },
      }],
    }));

  const result = await getPageContent('/mocked/path', { references: true });

  expect(result).toStrictEqual({
    id: 'test-id',
    content: 'test content',
    image: 'test image',
    background: 'test background',
    description: 'test description',
    references: ['test-reference-1', 'test-reference-2'],
  });
});

it('Returns page content entry using preview client', async () => {
  (contentfulPreviewClient.getEntries as jest.Mock)
    .mockImplementation(() => ({
      items: [{
        sys: { id: 'test-id' },
        fields: {
          content: 'test content',
          image: 'test image',
          background: 'test background',
          description: 'test description',
          references: ['test-reference-1', 'test-reference-2'],
        },
      }],
    }));

  const result = await getPageContent('/mocked/path', { preview: true });

  expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(0);

  expect(contentfulPreviewClient.getEntries).toHaveBeenCalledTimes(1);
  expect(contentfulPreviewClient.getEntries).toHaveBeenNthCalledWith(1, {
    content_type: 'page',
    'fields.path': '/mocked/path',
    limit: 1,
    include: 2,
  });

  expect(result).toStrictEqual({
    id: 'test-id',
    content: 'test content',
    image: 'test image',
    background: 'test background',
    description: 'test description',
  });
});

it('Returns page content entry with missing fields', async () => {
  (contentfulDeliveryClient.getEntries as jest.Mock)
    .mockImplementation(() => ({
      items: [{
        sys: { id: 'test-id' },
        fields: {},
      }],
    }));

  const result = await getPageContent('/mocked/path', { references: true });

  expect(result).toStrictEqual({
    id: 'test-id',
    content: null,
    image: null,
    background: null,
    description: null,
    references: null,
  });
});
