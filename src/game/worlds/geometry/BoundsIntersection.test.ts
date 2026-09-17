import { describe, expect, it } from "vitest";
import {
  boundsIntersect,
} from "./BoundsIntersection";
import type { Bounds } from "./GeometryBounds";

describe("boundsIntersect", () => {
  const base: Bounds = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };

  it("detects overlapping bounds", () => {
    const other: Bounds = {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
    };

    expect(
      boundsIntersect(base, other)
    ).toBe(true);
  });

  it("detects complete containment", () => {
    const other: Bounds = {
      x: 20,
      y: 20,
      width: 20,
      height: 20,
    };

    expect(
      boundsIntersect(base, other)
    ).toBe(true);
  });

  it("detects when the first bounds is contained", () => {
    const other: Bounds = {
      x: -50,
      y: -50,
      width: 200,
      height: 200,
    };

    expect(
      boundsIntersect(base, other)
    ).toBe(true);
  });

  it("returns false when completely separated horizontally", () => {
    const other: Bounds = {
      x: 100,
      y: 0,
      width: 50,
      height: 50,
    };

    expect(
      boundsIntersect(base, other)
    ).toBe(false);
  });

  it("returns false when completely separated vertically", () => {
    const other: Bounds = {
      x: 0,
      y: 100,
      width: 50,
      height: 50,
    };

    expect(
      boundsIntersect(base, other)
    ).toBe(false);
  });

  it("returns false when diagonally separated", () => {
    const other: Bounds = {
      x: 100,
      y: 100,
      width: 50,
      height: 50,
    };

    expect(
      boundsIntersect(base, other)
    ).toBe(false);
  });

  it("does not count touching edges as intersection", () => {
    const other: Bounds = {
      x: 100,
      y: 0,
      width: 50,
      height: 50,
    };

    expect(
      boundsIntersect(base, other)
    ).toBe(false);
  });
});