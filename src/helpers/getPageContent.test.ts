import { afterEach, describe, expect, it, vi } from "vitest";
import { contentfulDeliveryClient, contentfulPreviewClient } from "./contentful";

import getPageContent from "./getPageContent";

vi.mock(import("./flattenAssetFields"), () => ({
  flattenImageAssetFields: vi.fn((item) => item),
  flattenVideoAssetFields: vi.fn((item) => item),
}));

vi.mock(import("./contentful"), () => ({
  contentfulDeliveryClient: {
    getEntries: vi.fn<() => void>(),
  },
  contentfulPreviewClient: {
    getEntries: vi.fn<() => void>(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe(getPageContent, () => {
  it("returns page content entry with defaults", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(() => ({
      items: [
        {
          sys: { id: "test-id" },
          fields: {
            description: "test description",
            content: "test content",
            data: { foo: "bar" },
            image: "test image",
            background: "test background",
            references: ["test-reference-1", "test-reference-2"],
          },
        },
      ],
    }));

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
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(() => ({
      items: [
        {
          sys: { id: "test-id" },
          fields: {
            description: "test description",
            content: "test content",
            data: { foo: "bar" },
            image: "test image",
            background: "test background",
            references: ["test-reference-1", "test-reference-2"],
          },
        },
      ],
    }));

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
    vi.mocked(contentfulPreviewClient.getEntries).mockImplementation(() => ({
      items: [
        {
          sys: { id: "test-id" },
          fields: {
            description: "test description",
            content: "test content",
            data: { foo: "bar" },
            image: "test image",
            background: "test background",
            references: ["test-reference-1", "test-reference-2"],
          },
        },
      ],
    }));

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
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(() => ({
      items: [
        {
          sys: { id: "test-id" },
          fields: {},
        },
      ],
    }));

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
