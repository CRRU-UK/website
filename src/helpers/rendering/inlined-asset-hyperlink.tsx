/* eslint-disable @typescript-eslint/no-explicit-any */
/* istanbul ignore file */

import type { Node, Text } from "@contentful/rich-text-types";

import Link from "next/link";

const renderInlinedAssetHyperlink = ({ content, data }: any) => (
  <Link href={`https:${(data as Node["data"]).target.fields.file.url}`}>
    {(content[0] as Text).value}
  </Link>
);

export default renderInlinedAssetHyperlink;
