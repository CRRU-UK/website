import { afterEach, describe, expect, it, vi } from "vitest";
import { contentfulDeliveryClient, contentfulPreviewClient } from "./contentful";

import getPageContent from "./getPageContent";

vi.mock("./flattenAssetFields", () => ({
  flattenImageAssetFields: vi.fn((item) => item),
  flattenVideoAssetFields: vi.fn((item) => item),
}));

vi.mock("./contentful", () => ({
  contentfulDeliveryClient: {
    getEntries: vi.fn<() => void>(),
  },
  contentfulPreviewClient: {
    getEntries: vi.fn<() => void>(),
  },
}));

const mockedEntry = {
  sys: { id: "test-id" },
  fields: {
    description: "test description",
    content: "test content",
    data: { foo: "bar" },
    image: "test image",
    background: "test background",
    references: ["test-reference-1", "test-reference-2"],
  },
};

// The helper reads entries back through stringifySafe, which the SDK mixes on at runtime
const mockedResponse = (items: Array<unknown>) => ({
  items,
  stringifySafe: () => JSON.stringify({ items }),
});

afterEach(() => {
  vi.clearAllMocks();
});

describe(getPageContent, () => {
  it("returns page content entry with defaults", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () => mockedResponse([mockedEntry]) as any,
    );

    const result = await getPageContent("/mocked/path");

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "page",
      "fields.path": "/mocked/path",
      limit: 1,
      include: 2,
    });

    expect(contentfulPreviewClient.getEntries).toHaveBeenCalledTimes(0);

    expect(result).toStrictEqual({
      id: "test-id",
      description: "test description",
      content: "test content",
      data: { foo: "bar" },
      image: "test image",
      background: "test background",
    });
  });

  it("returns page content entry with options", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () => mockedResponse([mockedEntry]) as any,
    );

    const result = await getPageContent("/mocked/path", { references: true });

    expect(result).toStrictEqual({
      id: "test-id",
      description: "test description",
      content: "test content",
      data: { foo: "bar" },
      image: "test image",
      background: "test background",
      references: ["test-reference-1", "test-reference-2"],
    });
  });

  it("returns page content entry using preview client", async () => {
    vi.mocked(contentfulPreviewClient.getEntries).mockImplementation(
      () => mockedResponse([mockedEntry]) as any,
    );

    const result = await getPageContent("/mocked/path", { preview: true });

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(0);

    expect(contentfulPreviewClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulPreviewClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "page",
      "fields.path": "/mocked/path",
      limit: 1,
      include: 2,
    });

    expect(result).toStrictEqual({
      id: "test-id",
      description: "test description",
      content: "test content",
      data: { foo: "bar" },
      image: "test image",
      background: "test background",
    });
  });

  it("returns page content entry with missing fields", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(
      () => mockedResponse([{ sys: { id: "test-id" }, fields: {} }]) as any,
    );

    const result = await getPageContent("/mocked/path", { references: true });

    expect(result).toStrictEqual({
      id: "test-id",
      description: null,
      content: null,
      data: null,
      image: null,
      background: null,
      references: null,
    });
  });
});
