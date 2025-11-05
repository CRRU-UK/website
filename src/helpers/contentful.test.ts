import * as contentful from "contentful";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("contentful", () => ({
  createClient: vi.fn(() => ({
    withoutUnresolvableLinks: vi.fn<() => void>(),
  })),
}));

describe(contentful.createClient, () => {
  beforeAll(() => {
    require("./contentful"); // eslint-disable-line @typescript-eslint/no-require-imports
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("mocks createClient", () => {
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
