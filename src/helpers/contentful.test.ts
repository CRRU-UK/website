import * as contentful from "contentful";

jest.mock("contentful", () => ({
  createClient: jest.fn(() => ({
    withoutUnresolvableLinks: jest.fn(),
  })),
}));

beforeAll(() => {
  require("./contentful"); // eslint-disable-line @typescript-eslint/no-require-imports
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Contentful Helpers", () => {
  it("Mocks createClient", () => {
    expect(contentful.createClient).toHaveBeenCalledTimes(2);

    expect(contentful.createClient).toHaveBeenNthCalledWith(1, {
      space: "mock-contentful-space-id",
      environment: "mock-contentful-environment",
      accessToken: "mock-contentful-delivery-token",
    });

    expect(contentful.createClient).toHaveBeenNthCalledWith(2, {
      space: "mock-contentful-space-id",
      environment: "mock-contentful-environment",
      accessToken: "mock-contentful-preview-token",
      host: "preview.contentful.com",
    });
  });
});
