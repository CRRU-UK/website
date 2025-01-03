/* istanbul ignore file */

import type { Node } from "@contentful/rich-text-types";

import Link from "next/link";

import sitemap from "@/data/sitemap.json";

import { InlineContentEntries } from "../constants";

const renderInlinedEntries = ({ data }: Node) => {
  const contentTypeID = data.target.sys.contentType.sys.id;

  if (contentTypeID === InlineContentEntries.Page) {
    const result = Object.values(sitemap).find(
      ({ path }) => path === data.target.fields.path,
    );
    if (!result?.title) {
      return null;
    }
    return <Link href={data.target.fields.path}>{result.title}</Link>;
  }

  if (contentTypeID === InlineContentEntries.Species) {
    return (
      <Link href={`/education/species/${data.target.fields.slug}`}>
        {data.target.fields.name}
      </Link>
    );
  }

  if (contentTypeID === InlineContentEntries.News) {
    return (
      <Link href={`/news/${data.target.fields.slug}`}>
        {data.target.fields.title}
      </Link>
    );
  }

  return null;
};

export default renderInlinedEntries;
