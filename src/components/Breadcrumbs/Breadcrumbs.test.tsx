import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { Props } from "./Breadcrumbs";

import Breadcrumbs from "./Breadcrumbs";

describe(Breadcrumbs, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(
        <Breadcrumbs
          items={[
            {
              title: "World",
              path: "/hello",
            },
            {
              title: "Bar",
              path: "/hello/foo",
            },
          ]}
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(
        <Breadcrumbs
          items={[
            {
              title: "World",
              path: "/hello",
            },
            {
              title: "Bar",
              path: "/hello/foo",
            },
          ]}
          style="wide"
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it.each(["wide", "inline"])("passes accessibility with different styles", async (style) =>
    act(async () => {
      const { container } = render(<Breadcrumbs items={[]} style={style as Props["style"]} />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
