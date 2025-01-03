import "@testing-library/jest-dom";

import type { Props } from "./Breadcrumbs";

import { act } from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import Breadcrumbs from "./Breadcrumbs";

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it("Passes accessibility with default props", async () =>
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

    expect(results).toHaveNoViolations();
  }));

it("Passes accessibility with optional props", async () =>
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

    expect(results).toHaveNoViolations();
  }));

it.each(["wide", "inline"])(
  "Passes accessibility with different styles",
  async (style) =>
    act(async () => {
      const { container } = render(
        <Breadcrumbs style={style as Props["style"]} items={[]} />,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    }),
);
