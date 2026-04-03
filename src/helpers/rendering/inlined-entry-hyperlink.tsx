/* istanbul ignore file */

import type { Block, Inline, Text } from "@contentful/rich-text-types";

import Link from "next/link";

import { InlineContentEntries } from "../constants";

const renderInlinedEntryHyperlink = ({ content, data }: Block | Inline) => {
  const contentTypeID = data.target.sys.contentType.sys.id;

  if (contentTypeID === InlineContentEntries.Page) {
    return <Link href={data.target.fields.path}>{(content[0] as Text).value}</Link>;
  }

  if (contentTypeID === InlineContentEntries.Species) {
    return (
      <Link href={`/education/species/${data.target.fields.slug}`}>
        {(content[0] as Text).value}
      </Link>
    );
  }

  if (contentTypeID === InlineContentEntries.News) {
    return <Link href={`/news/${data.target.fields.slug}`}>{(content[0] as Text).value}</Link>;
  }

  return null;
};

export default renderInlinedEntryHyperlink;
