/* istanbul ignore file */

import { documentToReactComponents, type NodeRenderer } from "@contentful/rich-text-react-renderer";
import type { Node } from "@contentful/rich-text-types";
import type { Asset, AssetFile } from "contentful";
import { Gallery, Highlight, ImageRow, Note } from "@/components";
import { EmbeddedContentEntries } from "@/helpers/constants";
import { flattenImageAssetFields } from "@/helpers/flattenAssetFields";
import pageRenderOptions from "@/helpers/rendering/index";

const renderGallery = (data: Node["data"]) => {
  const images = data.target.fields.images.map((item: Asset) => flattenImageAssetFields(item));

  return <Gallery images={images} />;
};

const renderImageRow = (data: Node["data"]) => {
  const images = data.target.fields.images.map(({ fields }: Asset) => ({
    src: `https:${(fields.file as AssetFile).url}`,
    caption: fields.description,
    // biome-ignore lint/style/noNonNullAssertion: image assets always have dimensions
    width: (fields.file as AssetFile).details.image!.width,
    // biome-ignore lint/style/noNonNullAssertion: image assets always have dimensions
    height: (fields.file as AssetFile).details.image!.height,
  }));

  return <ImageRow items={images} />;
};

const renderHighlight = (data: Node["data"]) => {
  const content = documentToReactComponents(data.target.fields.content, pageRenderOptions);
  const { style } = data.target.fields;

  if (style === "Note") {
    return <Note>{content}</Note>;
  }

  return <Highlight warning={style === "Warning"}>{content}</Highlight>;
};

const renderColumns = (data: Node["data"]) => {
  let style = "";
  if (data.target.fields.style === "Left") {
    style = "left";
  } else if (data.target.fields.style === "Right") {
    style = "right";
  }

  return (
    <section className={`columns ${style}`}>
      <div className="columns-left">
        {documentToReactComponents(data.target.fields.leftColumn, pageRenderOptions)}
      </div>
      <div className="columns-right">
        {documentToReactComponents(data.target.fields.rightColumn, pageRenderOptions)}
      </div>
    </section>
  );
};

const renderVideo = (data: Node["data"]) => (
  <iframe
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    height="315"
    src={data.target.fields.url}
    title="YouTube video player"
    width="560"
  />
);

const renderModule = (data: Node["data"]) => {
  if (data.target.fields.id === "membership-paypal-button") {
    return (
      <form action="https://www.paypal.com/cgi-bin/webscr" className="paypal" method="post">
        <input name="cmd" type="hidden" value="_s-xclick" />
        <input name="hosted_button_id" type="hidden" value="68DD5VDPDK3TQ" />
        <input
          alt="PayPal - The safer, easier way to pay online."
          name="submit"
          src="https://www.paypalobjects.com/WEBSCR-640-20110401-1/en_GB/i/btn/btn_subscribe_SM.gif"
          type="image"
        />
        {/* biome-ignore lint/performance/noImgElement: external PayPal tracking pixel */}
        <img
          alt=""
          height="1"
          src="https://www.paypalobjects.com/WEBSCR-640-20110401-1/en_GB/i/scr/pixel.gif"
          width="1"
        />
      </form>
    );
  }

  return null;
};

const renderEmbeddedEntries: NodeRenderer = ({ data }: Node) => {
  const contentTypeID = data?.target?.sys.contentType.sys.id;
  if (!contentTypeID) {
    return null;
  }

  if (contentTypeID === EmbeddedContentEntries.Gallery) {
    return renderGallery(data);
  }

  if (contentTypeID === EmbeddedContentEntries.ImageRow) {
    return renderImageRow(data);
  }

  if (contentTypeID === EmbeddedContentEntries.Highlight) {
    return renderHighlight(data);
  }

  if (contentTypeID === EmbeddedContentEntries.Columns) {
    return renderColumns(data);
  }

  if (contentTypeID === EmbeddedContentEntries.Video) {
    return renderVideo(data);
  }

  if (contentTypeID === EmbeddedContentEntries.Module) {
    return renderModule(data);
  }

  return null;
};

export default renderEmbeddedEntries;
