/* istanbul ignore file */

import { BLOCKS, INLINES } from "@contentful/rich-text-types";

import renderEmbeddedAssets from "./embedded-assets";
import renderEmbeddedEntries from "./embedded-entries";
import renderInlinedAssetHyperlink from "./inlined-asset-hyperlink";
import renderInlinedEntries from "./inlined-entries";
import renderInlinedHyperlinks from "./inlined-entry-hyperlink";
import renderInlinedHyperlink from "./inlined-hyperlink";
import renderTypography from "./typography";

const pageRenderOptions = {
  renderNode: {
    [INLINES.HYPERLINK]: renderInlinedHyperlink,
    [INLINES.ENTRY_HYPERLINK]: renderInlinedHyperlinks,
    [INLINES.ASSET_HYPERLINK]: renderInlinedAssetHyperlink,
    [INLINES.EMBEDDED_ENTRY]: renderInlinedEntries,
    [BLOCKS.EMBEDDED_ENTRY]: renderEmbeddedEntries,
    [BLOCKS.EMBEDDED_ASSET]: renderEmbeddedAssets,
    ...renderTypography,
  },
};

export default pageRenderOptions;
