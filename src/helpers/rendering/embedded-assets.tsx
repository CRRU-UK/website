/* istanbul ignore file */

import type { Node } from '@contentful/rich-text-types';

import Link from 'next/link';

import { ImageRow } from '@/components/index';

const renderEmbeddedEntriesAssets = ({ data }: Node) => {
  if (!data?.target?.fields) {
    return null;
  }

  const { title, description, file } = data.target.fields;
  const { contentType } = file;

  if (contentType.startsWith('image')) {
    return (
      <ImageRow
        items={[{
          src: `https:${file.url}`,
          caption: description,
          width: file.details.image.width,
          height: file.details.image.height,
        }]}
      />
    );
  }

  if (contentType.startsWith('video')) {
    return (
      <video
        src={`https:${file.url}`}
        className="video"
        controls
      />
    );
  }

  return (
    <Link href={`https:${file.url}`}>{title}</Link>
  );
};

export default renderEmbeddedEntriesAssets;
