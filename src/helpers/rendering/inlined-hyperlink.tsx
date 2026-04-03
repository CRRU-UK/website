/* istanbul ignore file */

import type { Block, Inline, Text } from "@contentful/rich-text-types";

import Link from "next/link";

const renderInlinedHyperlink = ({ content, data }: Block | Inline) => {
  const url = data.uri;
  const isExternal = url.includes("http");

  return (
    <Link
      className={isExternal ? "external" : ""}
      href={url}
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {(content[0] as Text).value}
    </Link>
  );
};

export default renderInlinedHyperlink;
