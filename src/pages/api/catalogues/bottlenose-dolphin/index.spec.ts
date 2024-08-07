/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest } from 'next';

import { createRequest, createResponse } from 'node-mocks-http';

import { getCatalogueList } from '@/helpers/getBottlenoseDolphinCatalogue';

import handler from './index';

jest.mock('@/helpers/getBottlenoseDolphinCatalogue', () => ({
  getCatalogueList: jest.fn(() => ({ foo: 'bar' })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('Gets bottlenose dolphin catalogue list with pagination', async () => {
  const request = createRequest({
    method: 'GET',
    url: '/api/catalogues/bottlenose-dolphin',
    query: { page: 2 },
  }) as NextApiRequest;

  const response = createResponse();

  await handler(request, response as any);

  expect(getCatalogueList).toHaveBeenCalledTimes(1);
  expect(getCatalogueList).toHaveBeenCalledWith({ page: 2 });

  expect(response.statusCode).toBe(200);
  expect(response._getJSONData()).toStrictEqual({ foo: 'bar' });
});

it('Gets bottlenose dolphin catalogue list with searching', async () => {
  const request = createRequest({
    method: 'GET',
    url: '/api/catalogues/bottlenose-dolphin',
    query: { page: 1, search: 'hello' },
  }) as NextApiRequest;

  const response = createResponse();

  await handler(request, response as any);

  expect(getCatalogueList).toHaveBeenCalledTimes(1);
  expect(getCatalogueList).toHaveBeenCalledWith({ page: 1, search: 'hello' });

  expect(response.statusCode).toBe(200);
  expect(response._getJSONData()).toStrictEqual({ foo: 'bar' });
});

it('Handles incorrect method', async () => {
  const request = createRequest({
    method: 'POST',
    url: '/api/catalogues/bottlenose-dolphin',
    query: { page: 1 },
  }) as NextApiRequest;

  const response = createResponse();

  await handler(request, response as any);

  expect(getCatalogueList).toHaveBeenCalledTimes(0);

  expect(response.statusCode).toBe(405);
  expect(response._getData()).toBe('Method Not Allowed');
});

it('Handles missing page query', async () => {
  const request = createRequest({
    method: 'GET',
    url: '/api/catalogues/bottlenose-dolphin',
  }) as NextApiRequest;

  const response = createResponse();

  await handler(request, response as any);

  expect(getCatalogueList).toHaveBeenCalledTimes(0);

  expect(response.statusCode).toBe(400);
  expect(response._getData()).toBe('Missing `page` param');
});

it.each([
  'foo',
  0,
  1.5,
])('Handles incorrect page query value (%p)', async (value) => {
  const request = createRequest({
    method: 'GET',
    url: '/api/catalogues/bottlenose-dolphin',
    query: { page: value },
  }) as NextApiRequest;

  const response = createResponse();

  await handler(request, response as any);

  expect(getCatalogueList).toHaveBeenCalledTimes(0);

  expect(response.statusCode).toBe(400);
  expect(response._getData()).toBe('`page` param must be an integer greater than 0');
});
