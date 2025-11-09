import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Loading from "./Loading";

describe(Loading, () => {
  it("passes accessibility", async () =>
    act(async () => {
      const { container } = render(
        // @ts-expect-error String of enum value
        <Loading type="bottlenose-dolphin" />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
