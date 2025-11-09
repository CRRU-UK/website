import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Tooltip from "./Tooltip";

describe(Tooltip, () => {
  it("passes accessibility with default props", async () => {
    const { container } = render(<Tooltip text="mocked tooltip" />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
