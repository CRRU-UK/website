/* istanbul ignore file */

import { INLINES, BLOCKS } from '@contentful/rich-text-types';

import renderInlinedHyperlink from './inlined-hyperlink';
import renderInlinedHyperlinks from './inlined-entry-hyperlink';
import renderInlinedAssetHyperlink from './inlined-asset-hyperlink';
import renderInlinedEntries from './inlined-entries';
import renderEmbeddedEntries from './embedded-entries';
import renderEmbeddedAssets from './embedded-assets';
import renderTypography from './typography';

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
