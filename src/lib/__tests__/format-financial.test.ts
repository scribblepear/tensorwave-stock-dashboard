import { describe, test, expect } from "vitest";
import {
  formatLargeNumber,
  formatPercent,
  formatRatio,
  formatCurrency,
} from "../format-financial";

describe("formatLargeNumber", () => {
  test("formats trillions", () => {
    expect(formatLargeNumber("1500000000000")).toBe("$1.5T");
  });

  test("formats billions", () => {
    expect(formatLargeNumber("2300000000")).toBe("$2.3B");
  });

  test("formats millions", () => {
    expect(formatLargeNumber("45600000")).toBe("$45.6M");
  });

  test("formats small numbers with commas", () => {
    expect(formatLargeNumber("999999")).toBe("$999,999");
  });

  test("handles None", () => {
    expect(formatLargeNumber("None")).toBe("N/A");
  });

  test("handles undefined", () => {
    expect(formatLargeNumber(undefined)).toBe("N/A");
  });

  test("handles garbage input", () => {
    expect(formatLargeNumber("abc")).toBe("N/A");
  });

  test("handles empty string", () => {
    expect(formatLargeNumber("")).toBe("N/A");
  });
});

describe("formatPercent", () => {
  test("converts decimal to percent", () => {
    expect(formatPercent("0.1234")).toBe("12.34%");
  });

  test("handles small decimals", () => {
    expect(formatPercent("0.0052")).toBe("0.52%");
  });

  test("handles negative values", () => {
    expect(formatPercent("-0.15")).toBe("-15.00%");
  });

  test("handles None", () => {
    expect(formatPercent("None")).toBe("N/A");
  });

  test("handles zero", () => {
    expect(formatPercent("0")).toBe("0.00%");
  });
});

describe("formatRatio", () => {
  test("formats to 2 decimal places", () => {
    expect(formatRatio("25.678")).toBe("25.68");
  });

  test("treats zero as N/A", () => {
    expect(formatRatio("0")).toBe("N/A");
  });

  test("treats string '0' as N/A", () => {
    expect(formatRatio("0")).toBe("N/A");
  });

  test("handles None", () => {
    expect(formatRatio("None")).toBe("N/A");
  });

  test("handles negative ratios", () => {
    expect(formatRatio("-3.14159")).toBe("-3.14");
  });
});

describe("formatCurrency", () => {
  test("formats with dollar sign and 2 decimals", () => {
    expect(formatCurrency("123.456")).toBe("$123.46");
  });

  test("pads with zeros", () => {
    expect(formatCurrency("5")).toBe("$5.00");
  });

  test("handles None", () => {
    expect(formatCurrency("None")).toBe("N/A");
  });

  test("handles undefined", () => {
    expect(formatCurrency(undefined)).toBe("N/A");
  });

  test("handles negative prices", () => {
    expect(formatCurrency("-12.5")).toBe("$-12.50");
  });
});
