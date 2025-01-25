/* eslint-disable @typescript-eslint/no-require-imports */

process.env.NODE_CONTENTFUL_SPACE_ID = "mock-contentful-space-id";
process.env.NODE_CONTENTFUL_ENVIRONMENT = "mock-contentful-environment";
process.env.NODE_CONTENTFUL_DELIVERY_API_TOKEN = "mock-contentful-delivery-token";
process.env.NODE_CONTENTFUL_PREVIEW_API_TOKEN = "mock-contentful-preview-token";

module.exports = require("jest-environment-jsdom");
