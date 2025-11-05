import { afterEach, describe, expect, it, vi } from "vitest";
import { contentfulDeliveryClient } from "./contentful";

import getPageModule from "./getPageModule";

vi.mock("./contentful", () => ({
  contentfulDeliveryClient: {
    getEntries: vi.fn<() => void>(),
  },
}));

const mockedEntryFields = {
  content: "test content",
};

afterEach(() => {
  vi.clearAllMocks();
});

describe(getPageModule, () => {
  it("returns page module entry with all properties", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(() => ({
      items: [
        {
          fields: {
            ...mockedEntryFields,
            data: "test data",
          },
        },
      ],
    }));

    const result = await getPageModule("mocked-id");

    expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
    expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: "pageModule",
      "fields.id": "mocked-id",
      limit: 1,
    });

    expect(result).toStrictEqual({
      content: "test content",
      data: "test data",
    });
  });

  it("returns page module entry with missing properties", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(() => ({
      items: [
        {
          fields: mockedEntryFields,
        },
      ],
    }));

    const result = await getPageModule("mocked-id");

    expect(result).toStrictEqual({
      content: "test content",
      data: null,
    });
  });

  it("returns null for no entries", async () => {
    vi.mocked(contentfulDeliveryClient.getEntries).mockImplementation(() => ({
      items: [],
    }));

    const result = await getPageModule("mocked-id");

    expect(result).toBeNull();
  });
});
