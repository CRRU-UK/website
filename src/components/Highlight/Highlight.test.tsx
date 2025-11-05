import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Highlight from "./Highlight";

describe(Highlight, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(
        <Highlight>
          <p>Hello world</p>
        </Highlight>,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(
        <Highlight warning>
          <p>Hello world</p>
        </Highlight>,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
