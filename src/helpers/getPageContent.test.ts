import { afterEach, describe, expect, it, vi } from "vitest";
import contentful from "./contentful";

import getPageContent from "./getPageContent";

vi.mock("./flattenAssetFields", () => ({
  flattenImageAssetFields: vi.fn((item) => item),
  flattenVideoAssetFields: vi.fn((item) => item),
}));

vi.mock("./contentful", () => ({
  default: vi.fn(() => ({
    getEntries: vi.fn<() => void>(),
  })),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe(getPageContent, () => {
  it("returns page content entry with defaults", async () => {
    vi.mocked(contentful.getEntries).mockImplementation(
      () =>
        ({
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
        }) as any,
    );

    const result = await getPageContent("/mocked/path");

    expect(contentful.getEntries).toHaveBeenCalledTimes(1);
    expect(contentful.getEntries).toHaveBeenNthCalledWith(1, {
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

  it("returns page content entry with options", async () => {
    vi.mocked(contentful.getEntries).mockImplementation(
      () =>
        ({
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
        }) as any,
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

  it("returns page content entry with missing fields", async () => {
    vi.mocked(contentful.getEntries).mockImplementation(
      () =>
        ({
          items: [
            {
              sys: { id: "test-id" },
              fields: {},
            },
          ],
        }) as any,
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
