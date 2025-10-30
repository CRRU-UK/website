import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Hero from "./Hero";

describe(Hero, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(
        <Hero title="test title" subtitle="test subtitle" background="/test-image.jpg" />,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(<Hero title="test title" subtitle="test subtitle" plain wide />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    }));
});
