import * as contentful from "contentful";

const client = contentful.createClient({
  space: String(process.env.NODE_CONTENTFUL_SPACE_ID),
  environment: String(process.env.NODE_CONTENTFUL_ENVIRONMENT),
  accessToken: String(process.env.NODE_CONTENTFUL_DELIVERY_API_TOKEN),
}).withoutUnresolvableLinks;

export default client;
