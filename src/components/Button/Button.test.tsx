import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Button from "./Button";

describe(Button, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(<Button text="test text" link="/test-link" />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(<Button text="test text" link="/test-link" external inline />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    }));
});
