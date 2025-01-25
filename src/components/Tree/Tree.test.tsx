import "@testing-library/jest-dom";

import { act } from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import type { CatalogueBottlenoseDolphin } from "@/helpers/types";

import Tree from "./Tree";

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

const mockedEntryData = {
  birthYear: null,
  sex: "Unknown",
  totalRecaptures: null,
  yearsRecaptured: null,
  totalCalves: null,
  leftDorsalFin: null,
  rightDorsalFin: null,
  otherImages: [],
  lastUpdated: "mocked last updated",
};

const mockedMotherCalvesData = {
  mother: {
    id: "mocked mother id",
    reference: "mocked mother reference",
    name: "mocked mother name",
    slug: "mocked mother slug",
  },
  calves: [],
};

it("Passes accessibility with default props", async () =>
  act(async () => {
    const { container } = render(
      <Tree
        // @ts-expect-error String of enum value
        type="bottlenose-dolphin"
        data={
          {
            ...mockedMotherCalvesData,
            entry: {
              ...mockedEntryData,
              id: "mocked id",
              reference: "mocked reference",
              name: "mocked name",
              slug: "mocked slug",
            },
          } as CatalogueBottlenoseDolphin
        }
      />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  }));
