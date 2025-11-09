import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import ImageRow from "./ImageRow";

describe(ImageRow, () => {
  it("passes accessibility", async () => {
    const { container } = render(
      <ImageRow
        items={[
          {
            src: "/foo/bar/1",
            width: 100,
            height: 200,
            caption: "mocked caption 1",
          },
          {
            src: "/foo/bar/2",
            width: 200,
            height: 300,
            caption: "mocked caption 2",
          },
        ]}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
