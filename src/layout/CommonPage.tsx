import type React from 'react';

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useContentfulInspectorMode, useContentfulLiveUpdates } from '@contentful/live-preview/react';

import type { SitemapItem, PageData } from '@/helpers/types';

import { LOCALE } from '@/helpers/constants';
import pageRenderOptions from '@/helpers/rendering';

import Hero from '@/components/Hero/Hero';
import { Breadcrumbs, SEO } from '@/components';

interface Props {
  page: SitemapItem,
  parent?: SitemapItem,
  breadcrumbs: Array<SitemapItem>,
  data: PageData,
  children?: React.JSX.Element | React.JSX.Element[],
  wide?: boolean,
}

const CommonPage = ({
  page,
  parent,
  breadcrumbs,
  data,
  children,
  wide = false,
}: Props) => {
  const backgroundImage = data?.background?.url ? `url(${data.background.url})` : undefined;

  const previewProps = useContentfulInspectorMode();
  const previewData = useContentfulLiveUpdates({
    sys: { id: data.id },
    fields: { content: { [LOCALE]: data.content } },
  });

  return (
    <>
      <SEO
        page={{ ...page, description: data.description ?? undefined }}
        breadcrumbs={breadcrumbs}
        images={data?.image ? [{
          url: data?.image.url,
          width: data?.image.width,
          height: data?.image.height,
        }] : undefined}
      />

      <Hero
        title={page.title}
        subtitle={parent?.title}
        background={data?.image?.url}
        wide={wide}
      />

      <Breadcrumbs
        items={breadcrumbs}
        style={wide ? 'wide' : 'normal'}
      />

      <article
        className={`content ${wide ? 'wide' : ''}`}
        style={{ backgroundImage }}
        {...previewProps({
          entryId: previewData.sys.id as string,
          fieldId: 'content',
        })}
      >
        {data.content && documentToReactComponents(data.content, pageRenderOptions)}
        {children}
      </article>
    </>
  );
};

export default CommonPage;
