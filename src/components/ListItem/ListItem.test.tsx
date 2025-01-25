import "@testing-library/jest-dom";

import { act } from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import ListItem from "./ListItem";

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it("Passes accessibility", async () =>
  act(async () => {
    const { container } = render(<ListItem title="test title" />);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  }));

it("Passes accessibility with optional props", async () =>
  act(async () => {
    const { container } = render(
      <ListItem
        title="test title"
        description="test description"
        link="test link"
        image={{
          url: "https://test-url.jpg",
          width: 100,
          height: 200,
          alt: "test alt",
        }}
        category={{
          text: "test category",
          style: 2,
        }}
      />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  }));

it("Passes accessibility with no link and category style", async () =>
  act(async () => {
    const { container } = render(
      <ListItem
        title="test title"
        image={{
          url: "https://test-url.jpg",
          width: 100,
          height: 200,
          alt: "test alt",
        }}
        category={{
          text: "test category",
        }}
      />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  }));
