import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Button from "./Button";

describe(Button, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(<Button link="/test-link" text="test text" />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(<Button external inline link="/test-link" text="test text" />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
