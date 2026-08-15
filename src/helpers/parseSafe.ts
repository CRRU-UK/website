/**
 * Reads a Contentful response back through the SDK's `stringifySafe`, which swaps the circular
 * references link resolution creates.
 * @param response Contentful response.
 * @returns Copy of the response with every circular reference replaced by a link stub.
 */
const parseSafe = <T>(response: T): T =>
  JSON.parse((response as T & { stringifySafe: () => string }).stringifySafe());

export default parseSafe;
