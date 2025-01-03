import { contentfulDeliveryClient } from "./contentful";

import getSpecies from "./getSpecies";

jest.mock("./flattenAssetFields", () => ({
  flattenImageAssetFields: jest.fn((item) => item),
  flattenVideoAssetFields: jest.fn((item) => item),
}));

jest.mock("./contentful", () => ({
  contentfulDeliveryClient: {
    getEntries: jest.fn(),
  },
}));

const mockedEntryFields = {
  name: "test name",
  slug: "test-slug",
  order: "test order",
  suborder: "test suborder",
  family: "test family",
  genus: "test genus",
  species: "test species",
  content: "test content",
  description: "test description",
  image: "test image",
};

afterEach(() => {
  jest.clearAllMocks();
});

it("Returns species with all properties", async () => {
  (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
    items: [
      {
        fields: {
          ...mockedEntryFields,
          subfamily: "test subfamily",
        },
      },
    ],
  }));

  const result = await getSpecies();

  expect(contentfulDeliveryClient.getEntries).toHaveBeenCalledTimes(1);
  expect(contentfulDeliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
    content_type: "speciesPage",
    order: ["fields.name"],
    limit: 1000,
  });

  expect(result).toStrictEqual([
    {
      ...mockedEntryFields,
      subfamily: "test subfamily",
    },
  ]);
});

it("Returns species with missing properties", async () => {
  (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
    items: [
      {
        fields: mockedEntryFields,
      },
    ],
  }));

  const result = await getSpecies();

  expect(result).toStrictEqual([
    {
      ...mockedEntryFields,
      subfamily: null,
    },
  ]);
});
