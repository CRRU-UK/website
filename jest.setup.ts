/* eslint-disable @typescript-eslint/no-require-imports */

process.env.NODE_CONTENTFUL_SPACE_ID = "mocked-contentful-space-id";
process.env.NODE_CONTENTFUL_ENVIRONMENT = "mocked-contentful-environment";
process.env.NODE_CONTENTFUL_DELIVERY_API_TOKEN = "mocked-contentful-delivery-api-token";
process.env.NODE_CONTENTFUL_PREVIEW_API_TOKEN = "mocked-contentful-preview-api-token";

module.exports = require("jest-environment-jsdom");
