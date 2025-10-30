/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, it } from "vitest";
import { flattenImageAssetFields, flattenVideoAssetFields } from "./flattenAssetFields";

describe(flattenImageAssetFields, () => {
  const mockedImageFields = {
    file: {
      url: "//example.com/test-url",
      details: {
        image: {
          width: 100,
          height: 200,
        },
      },
    },
  };

  it("flattens asset field", () => {
    const result = flattenImageAssetFields({
      fields: {
        ...mockedImageFields,
        description: "test description",
      },
    } as any);

    expect(result).toStrictEqual({
      url: "https://example.com/test-url",
      width: 100,
      height: 200,
      alt: "test description",
    });
  });

  it("flattens asset field without description", () => {
    const result = flattenImageAssetFields({
      fields: mockedImageFields,
    } as any);

    expect(result).toStrictEqual({
      url: "https://example.com/test-url",
      width: 100,
      height: 200,
      alt: null,
    });
  });
});

describe(flattenVideoAssetFields, () => {
  const mockedImageFields = {
    file: {
      url: "//example.com/test-url",
      contentType: "video/mp4",
    },
  };

  it("flattens asset field", () => {
    const result = flattenVideoAssetFields({
      fields: mockedImageFields,
    } as any);

    expect(result).toStrictEqual({
      url: "https://example.com/test-url",
      type: "video/mp4",
    });
  });
});
