import type { Props } from "./Breadcrumbs";

import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

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
          style="wide"
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

  it.each(["wide", "inline"])("passes accessibility with different styles", async (style) =>
    act(async () => {
      const { container } = render(<Breadcrumbs style={style as Props["style"]} items={[]} />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }),
  );
});
