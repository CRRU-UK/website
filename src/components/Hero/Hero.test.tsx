import "@testing-library/jest-dom";

import { act } from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import Hero from "./Hero";

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it("Passes accessibility with default props", async () =>
  act(async () => {
    const { container } = render(
      <Hero
        title="test title"
        subtitle="test subtitle"
        background="/test-image.jpg"
      />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  }));

it("Passes accessibility with optional props", async () =>
  act(async () => {
    const { container } = render(
      <Hero title="test title" subtitle="test subtitle" plain wide />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  }));
