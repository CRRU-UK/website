/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest } from "next";

import { afterEach, describe, expect, it, vi } from "vitest";

import { createRequest, createResponse } from "node-mocks-http";

import { getCatalogueList } from "@/helpers/getCatalogue";

import handler from "../src/pages/api/catalogues/[catalogue]";

vi.mock("@/helpers/getCatalogue", () => ({
  getCatalogueList: vi.fn(() => ({ foo: "bar" })),
}));

describe("catalogue page", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each(["bottlenose-dolphin", "minke-whale"])(
    "gets catalogue list with pagination (%p)",
    async (value) => {
      const request = createRequest({
        method: "GET",
        url: `/api/catalogues/${value}`,
        query: {
          catalogue: value,
          page: 2,
        },
      }) as NextApiRequest;

      const response = createResponse();

      await handler(request, response as any);

      expect(getCatalogueList).toHaveBeenCalledTimes(1);
      expect(getCatalogueList).toHaveBeenCalledWith(value, { page: 2 });

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toStrictEqual({ foo: "bar" });
    },
  );

  it.each(["bottlenose-dolphin", "minke-whale"])(
    "gets catalogue list with searching",
    async (value) => {
      const request = createRequest({
        method: "GET",
        url: `/api/catalogues/${value}`,
        query: {
          catalogue: value,
          page: 1,
          search: "hello",
        },
      }) as NextApiRequest;

      const response = createResponse();

      await handler(request, response as any);

      expect(getCatalogueList).toHaveBeenCalledTimes(1);
      expect(getCatalogueList).toHaveBeenCalledWith(value, {
        page: 1,
        search: "hello",
      });

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toStrictEqual({ foo: "bar" });
    },
  );

  it("handles incorrect catalogue", async () => {
    const request = createRequest({
      method: "GET",
      url: "/api/catalogues/kangaroo",
      query: {
        catalogue: "kangaroo",
        page: 1,
      },
    }) as NextApiRequest;

    const response = createResponse();

    await handler(request, response as any);

    expect(getCatalogueList).toHaveBeenCalledTimes(0);

    expect(response.statusCode).toBe(404);
    expect(response._getData()).toBe("Not Found");
  });

  it("handles incorrect method", async () => {
    const request = createRequest({
      method: "POST",
      url: "/api/catalogues/bottlenose-dolphin",
      query: {
        catalogue: "bottlenose-dolphin",
        page: 1,
      },
    }) as NextApiRequest;

    const response = createResponse();

    await handler(request, response as any);

    expect(getCatalogueList).toHaveBeenCalledTimes(0);

    expect(response.statusCode).toBe(405);
    expect(response._getData()).toBe("Method Not Allowed");
  });

  it("handles missing page query", async () => {
    const request = createRequest({
      method: "GET",
      url: "/api/catalogues/bottlenose-dolphin",
      query: {
        catalogue: "bottlenose-dolphin",
      },
    }) as NextApiRequest;

    const response = createResponse();

    await handler(request, response as any);

    expect(getCatalogueList).toHaveBeenCalledTimes(0);

    expect(response.statusCode).toBe(400);
    expect(response._getData()).toBe("Missing `page` param");
  });

  it.each(["foo", 0, 1.5])("handles incorrect page query value (%p)", async (value) => {
    const request = createRequest({
      method: "GET",
      url: "/api/catalogues/bottlenose-dolphin",
      query: {
        catalogue: "bottlenose-dolphin",
        page: value,
      },
    }) as NextApiRequest;

    const response = createResponse();

    await handler(request, response as any);

    expect(getCatalogueList).toHaveBeenCalledTimes(0);

    expect(response.statusCode).toBe(400);
    expect(response._getData()).toBe("`page` param must be an integer greater than 0");
  });
});
