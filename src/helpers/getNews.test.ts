import { contentfulDeliveryClient } from "./contentful";

import getNews from "./getNews";

jest.mock("./flattenAssetFields", () => ({
  flattenImageAssetFields: jest.fn((item) => item),
}));

jest.mock("./contentful", () => ({
  contentfulDeliveryClient: {
    getEntries: jest.fn(),
  },
}));

const mockedEntries = {
  title: "test title",
  slug: "test-slug",
  date: "test date",
  category: "test category",
  keywords: ["test-keyword-1", "test-keyword-2"],
  content: "test content",
  description: "test description",
  image: "test image",
};

beforeEach(() => {
  (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
    items: [{ fields: mockedEntries }],
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});

it("Gets news articles", async () => {
  const result = await getNews({ limit: 12 });

  expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
  expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
    content_type: "newsArticle",
    order: ["-fields.date"],
    limit: 12,
  });

  expect(result).toStrictEqual([mockedEntries]);
});

it("Gets news articles with default limit", async () => {
  await getNews({});

  expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
  expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
    content_type: "newsArticle",
    order: ["-fields.date"],
    limit: 1000,
  });
});

it("Gets new articles with no keywords", async () => {
  (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
    items: [
      {
        fields: {
          ...mockedEntries,
          keywords: undefined,
        },
      },
    ],
  }));

  const result = await getNews({ limit: 100 });

  expect(result).toStrictEqual([
    {
      ...mockedEntries,
      keywords: [],
    },
  ]);
});
