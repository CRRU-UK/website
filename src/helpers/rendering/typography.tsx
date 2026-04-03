/* istanbul ignore file */

import type { NodeRenderer } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

const renderHeading1: NodeRenderer = (_data, children) => (
  <p className="large">
    <strong>{children}</strong>
  </p>
);

const renderHeading2: NodeRenderer = (_data, children) => (
  <p className="medium">
    <strong>{children}</strong>
  </p>
);

const renderHeading3: NodeRenderer = (_data, children) => (
  <p className="small">
    <strong>{children}</strong>
  </p>
);

const renderParagraph: NodeRenderer = (_data, children) => {
  if (!children?.toString().trim()) {
    return null;
  }

  return <p>{children}</p>;
};

const renderTypography = {
  [BLOCKS.HEADING_1]: renderHeading1,
  [BLOCKS.HEADING_2]: renderHeading2,
  [BLOCKS.HEADING_3]: renderHeading3,
  [BLOCKS.PARAGRAPH]: renderParagraph,
};

export default renderTypography;
