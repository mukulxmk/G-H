import { describe, expect, it } from "vitest";

import {
  getChunksForBounds,
} from "./BoundsToChunks";

describe("getChunksForBounds", () => {
  it("returns the center chunk for bounds inside one chunk", () => {
    expect(
      getChunksForBounds(
        {
          x: 100,
          y: 200,
          width: 300,
          height: 300,
        },
        1000
      )
    ).toEqual([
      { x: 0, y: 0 },
    ]);
  });

  it("returns multiple chunks when bounds cross a horizontal boundary", () => {
    expect(
      getChunksForBounds(
        {
          x: 900,
          y: 100,
          width: 200,
          height: 200,
        },
        1000
      )
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]);
  });

  it("returns multiple chunks when bounds cross a vertical boundary", () => {
    expect(
      getChunksForBounds(
        {
          x: 100,
          y: 900,
          width: 200,
          height: 200,
        },
        1000
      )
    ).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ]);
  });

  it("returns four chunks when bounds cross both boundaries", () => {
    expect(
      getChunksForBounds(
        {
          x: 900,
          y: 900,
          width: 200,
          height: 200,
        },
        1000
      )
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it("handles negative bounds", () => {
    expect(
      getChunksForBounds(
        {
          x: -1100,
          y: -900,
          width: 200,
          height: 200,
        },
        1000
      )
    ).toEqual([
      { x: -2, y: -1 },
      { x: -1, y: -1 },
    ]);
  });

  it("handles bounds spanning several chunks", () => {
    expect(
      getChunksForBounds(
        {
          x: -1500,
          y: -1500,
          width: 4000,
          height: 4000,
        },
        1000
      )
    ).toHaveLength(25);
  });

  it("includes boundary chunks", () => {
    expect(
      getChunksForBounds(
        {
          x: 1000,
          y: 1000,
          width: 1,
          height: 1,
        },
        1000
      )
    ).toEqual([
      { x: 1, y: 1 },
    ]);
  });

  it("handles zero-size bounds", () => {
    expect(
      getChunksForBounds(
        {
          x: 500,
          y: 500,
          width: 0,
          height: 0,
        },
        1000
      )
    ).toEqual([
      { x: 0, y: 0 },
    ]);
  });

  it("rejects an invalid chunk size", () => {
    expect(() =>
      getChunksForBounds(
        {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        },
        0
      )
    ).toThrow(
      "Chunk size must be greater than zero."
    );
  });
});