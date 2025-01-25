import { contentfulDeliveryClient } from "./contentful";

import getPageModule from "./getPageModule";

jest.mock("./contentful", () => ({
  contentfulDeliveryClient: {
    getEntries: jest.fn(),
  },
}));

const mockedEntryFields = {
  content: "test content",
};

afterEach(() => {
  jest.clearAllMocks();
});

it("Returns page module entry with all properties", async () => {
  (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
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

it("Returns page module entry with missing properties", async () => {
  (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
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

it("Returns null for no entries", async () => {
  (contentfulDeliveryClient.getEntries as jest.Mock).mockImplementation(() => ({
    items: [],
  }));

  const result = await getPageModule("mocked-id");

  expect(result).toBe(null);
});
