import { describe, expect, it } from "vitest";
import { formatDateMonth, formatDateRelative } from "./formatDate";

describe(formatDateRelative, () => {
  it("formats date shorted than 2 weeks", () => {
    const result = formatDateRelative("2023-01-01", "2023-01-14");

    expect(result).toBe("13 days ago");
  });

  it("formats date longer than 2 weeks", () => {
    const result = formatDateRelative("2023-01-01", "2023-01-15");

    expect(result).toBe("01/01/2023");
  });
});

describe(formatDateMonth, () => {
  it("formats date as long", () => {
    const result = formatDateMonth("2023-01-01");

    expect(result).toBe("January 2023");
  });
});
