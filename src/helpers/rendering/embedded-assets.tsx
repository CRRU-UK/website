/* istanbul ignore file */

import type { Node } from "@contentful/rich-text-types";

import Link from "next/link";

import { ImageRow } from "@/components";

const renderEmbeddedEntriesAssets = ({ data }: Node) => {
  if (!data?.target?.fields) {
    return null;
  }

  const { title, description, file } = data.target.fields;
  const { contentType } = file;

  if (contentType.startsWith("image")) {
    return (
      <ImageRow
        items={[
          {
            src: `https:${file.url}`,
            caption: description,
            width: file.details.image.width,
            height: file.details.image.height,
          },
        ]}
      />
    );
  }

  if (contentType.startsWith("video")) {
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <video src={`https:${file.url}`} className="video" controls />;
  }

  return <Link href={`https:${file.url}`}>{title}</Link>;
};

export default renderEmbeddedEntriesAssets;
