import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type React from "react";
import { Breadcrumbs, SEO } from "@/components";
import Hero from "@/components/Hero/Hero";
import { LOCALE } from "@/helpers/constants";
import pageRenderOptions from "@/helpers/rendering";
import type { PageData, SitemapItem } from "@/helpers/types";

interface Props {
  breadcrumbs: Array<SitemapItem>;
  children?: React.JSX.Element | React.JSX.Element[];
  data: PageData;
  page: SitemapItem;
  parent?: SitemapItem;
  wide?: boolean;
}

const CommonPage = ({ page, parent, breadcrumbs, data, children, wide = false }: Props) => {
  const backgroundImage = data?.background?.url ? `url(${data.background.url})` : undefined;

  const previewProps = useContentfulInspectorMode();
  const previewData = useContentfulLiveUpdates({
    sys: { id: data.id },
    fields: { content: { [LOCALE]: data.content } },
  });

  return (
    <>
      <SEO
        breadcrumbs={breadcrumbs}
        images={
          data?.image
            ? [
                {
                  url: data?.image.url,
                  width: data?.image.width,
                  height: data?.image.height,
                },
              ]
            : undefined
        }
        page={{ ...page, description: data.description ?? undefined }}
      />

      <Hero background={data?.image?.url} subtitle={parent?.title} title={page.title} wide={wide} />

      <Breadcrumbs items={breadcrumbs} style={wide ? "wide" : "normal"} />

      <article
        className={`content ${wide ? "wide" : ""}`}
        style={{ backgroundImage }}
        {...previewProps({
          entryId: previewData.sys.id as string,
          fieldId: "content",
        })}
      >
        {data.content && documentToReactComponents(data.content, pageRenderOptions)}
        {children}
      </article>
    </>
  );
};

export default CommonPage;
