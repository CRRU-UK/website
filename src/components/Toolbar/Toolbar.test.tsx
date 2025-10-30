import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Toolbar from "./Toolbar";

describe(Toolbar, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(
        <Toolbar
          // @ts-expect-error String of enum value
          type="bottlenose-dolphin"
          previous={null}
          next={null}
        />,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const mockedData = {
        id: "mocked-id",
        reference: "mocked-reference",
        name: "mocked-name",
        slug: "mocked slug",
      };

      const { container } = render(
        <Toolbar
          // @ts-expect-error String of enum value
          type="bottlenose-dolphin"
          previous={mockedData}
          next={mockedData}
        />,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    }));
});
