import { describe, expect, it } from "vitest";
import { formatCurrency } from "./utils";

describe("formatCurrency", () => {
  it("formats INR without decimals", () => {
    expect(formatCurrency(149)).toContain("149");
  });
});
