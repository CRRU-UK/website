import * as contentful from 'contentful';

const contentfulDeliveryClient = contentful.createClient({
  space: String(process.env.NODE_CONTENTFUL_SPACE_ID),
  environment: String(process.env.NODE_CONTENTFUL_ENVIRONMENT),
  accessToken: String(process.env.NODE_CONTENTFUL_DELIVERY_API_TOKEN),
}).withoutUnresolvableLinks;

const contentfulPreviewClient = contentful.createClient({
  space: String(process.env.NODE_CONTENTFUL_SPACE_ID),
  environment: String(process.env.NODE_CONTENTFUL_ENVIRONMENT),
  accessToken: String(process.env.NODE_CONTENTFUL_PREVIEW_API_TOKEN),
  host: 'preview.contentful.com',
}).withoutUnresolvableLinks;

export {
  contentfulDeliveryClient,
  contentfulPreviewClient,
};
