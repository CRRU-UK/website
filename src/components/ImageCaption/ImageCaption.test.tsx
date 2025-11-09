import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import ImageCaption from "./ImageCaption";

describe(ImageCaption, () => {
  it("passes accessibility with default props", async () => {
    const { container } = render(
      <ImageCaption src="/foo/bar" width={100} height={200} caption="mocked caption" />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it("passes accessibility with optional props", async () => {
    const { container } = render(<ImageCaption src="/foo/bar" width={100} height={200} />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
