/* istanbul ignore file */

import type { Node, Text } from '@contentful/rich-text-types';

import Link from 'next/link';

const renderInlinedHyperlink = ({ content, data }: any) => {
  const url = (data as Node['data']).uri;
  const isExternal = url.includes('http');

  return (
    <Link
      href={url}
      className={isExternal ? 'external' : ''}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      {(content[0] as Text).value}
    </Link>
  );
};

export default renderInlinedHyperlink;
