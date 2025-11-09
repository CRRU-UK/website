import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contentfulDeliveryClient } from "./contentful";

import getNews from "./getNews";

vi.mock("./flattenAssetFields", () => ({
  flattenImageAssetFields: vi.fn((item) => item),
}));

vi.mock("./contentful", () => ({
  contentfulDeliveryClient: {
    getEntries: vi.fn<() => void>(),
  },
}));

const mockedEntries = {
  title: "test title",
  slug: "test-slug",
  date: "test date",
  category: "test category",
  content: "test content",
  description: "test description",
  image: "test image",
};

beforeEach(() => {
  vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
    () =>
      ({
        items: [{ fields: mockedEntries }],
      }) as any,
  );
});

afterEach(() => {
  vi.clearAllMocks();
});

describe(getNews, () => {
  it("gets news articles", async () => {
    const result = await getNews({ limit: 12 });

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "newsArticle",
      order: ["-fields.date"],
      limit: 12,
    });

    expect(result).toStrictEqual([mockedEntries]);
  });

  it("gets news articles with default limit", async () => {
    await getNews({});

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "newsArticle",
      order: ["-fields.date"],
      limit: 1000,
    });
  });
});
