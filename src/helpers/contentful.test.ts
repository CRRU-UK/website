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
      space: "mocked-contentful-space-id",
      environment: "mocked-contentful-environment",
      accessToken: "mocked-contentful-delivery-api-token",
    });

    expect(contentful.createClient).toHaveBeenNthCalledWith(2, {
      space: "mocked-contentful-space-id",
      environment: "mocked-contentful-environment",
      accessToken: "mocked-contentful-preview-api-token",
      host: "preview.contentful.com",
    });
  });
});
