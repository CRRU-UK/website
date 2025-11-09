import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import Filters from "./Filters";

describe(Filters, () => {
  it("passes accessibility with default search props", async () =>
    act(async () => {
      const { container } = render(
        <Filters
          search={{
            callback: vi.fn<() => void>(),
          }}
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("passes accessibility with default dropdown props", async () =>
    act(async () => {
      const { container } = render(
        <Filters
          dropdowns={[
            {
              name: "test name",
              options: [
                {
                  text: "test text",
                  value: "text-value",
                },
              ],
              callback: vi.fn<() => void>(),
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
        <Filters
          search={{
            callback: vi.fn<() => void>(),
            label: "mocked label",
            defaultValue: "mocked default value",
          }}
          dropdowns={[
            {
              name: "test name",
              defaultValue: "mocked default value",
              options: [
                {
                  text: "test text 1",
                  value: "text-value-1",
                },
                {
                  text: "test text 2",
                  value: "text-value-2",
                },
              ],
              callback: vi.fn<() => void>(),
            },
          ]}
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
