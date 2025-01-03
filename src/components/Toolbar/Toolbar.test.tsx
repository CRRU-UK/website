import "@testing-library/jest-dom";

import { act } from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import Toolbar from "./Toolbar";

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it("Passes accessibility with default props", async () =>
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

it("Passes accessibility with optional props", async () =>
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
