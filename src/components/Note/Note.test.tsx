import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Note from "./Note";

describe(Note, () => {
  it("passes accessibility", async () =>
    act(async () => {
      const { container } = render(
        <Note>
          <p>Hello world</p>
        </Note>,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
