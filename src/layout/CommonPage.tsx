import type React from "react";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import type { PageData, SitemapItem } from "@/helpers/types";

import pageRenderOptions from "@/helpers/rendering";

import { Breadcrumbs, SEO } from "@/components";
import Hero from "@/components/Hero/Hero";

interface Props {
  page: SitemapItem;
  parent?: SitemapItem;
  breadcrumbs: Array<SitemapItem>;
  data: PageData;
  children?: React.JSX.Element | React.JSX.Element[];
  wide?: boolean;
}

const CommonPage = ({ page, parent, breadcrumbs, data, children, wide = false }: Props) => {
  const backgroundImage = data?.background?.url ? `url(${data.background.url})` : undefined;

  return (
    <>
      <SEO
        page={{ ...page, description: data.description ?? undefined }}
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
      />

      <Hero title={page.title} subtitle={parent?.title} background={data?.image?.url} wide={wide} />

      <Breadcrumbs items={breadcrumbs} style={wide ? "wide" : "normal"} />

      <article className={`content ${wide ? "wide" : ""}`} style={{ backgroundImage }}>
        {data.content && documentToReactComponents(data.content, pageRenderOptions)}
        {children}
      </article>
    </>
  );
};

export default CommonPage;
