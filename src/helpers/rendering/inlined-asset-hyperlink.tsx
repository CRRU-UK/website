/* istanbul ignore file */

import type { Block, Inline, Text } from "@contentful/rich-text-types";

import Link from "next/link";

const renderInlinedAssetHyperlink = ({ content, data }: Block | Inline) => (
  <Link href={`https:${data.target.fields.file.url}`}>{(content[0] as Text).value}</Link>
);

export default renderInlinedAssetHyperlink;
