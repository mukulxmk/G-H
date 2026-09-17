import { describe, expect, it } from "vitest";

import {
  worldToChunkCoordinates,
  getNearbyChunkCoordinates
} from "./ChunkCoordinates";

describe("worldToChunkCoordinates", () => {
  it("maps the origin to chunk 0,0", () => {
    expect(
      worldToChunkCoordinates(0, 0, 1000)
    ).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("maps positions inside a positive chunk", () => {
    expect(
      worldToChunkCoordinates(500, 750, 1000)
    ).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("maps positive positions to the correct chunk", () => {
    expect(
      worldToChunkCoordinates(1500, 2500, 1000)
    ).toEqual({
      x: 1,
      y: 2,
    });
  });

  it("handles exact positive chunk boundaries", () => {
    expect(
      worldToChunkCoordinates(1000, 2000, 1000)
    ).toEqual({
      x: 1,
      y: 2,
    });
  });

  it("handles negative positions correctly", () => {
    expect(
      worldToChunkCoordinates(-1, -1, 1000)
    ).toEqual({
      x: -1,
      y: -1,
    });
  });

  it("handles negative chunk boundaries correctly", () => {
    expect(
      worldToChunkCoordinates(-1000, -2000, 1000)
    ).toEqual({
      x: -1,
      y: -2,
    });
  });

  it("handles positions just outside negative boundaries", () => {
    expect(
      worldToChunkCoordinates(-1001, -2001, 1000)
    ).toEqual({
      x: -2,
      y: -3,
    });
  });

  it("supports non-square chunk sizes", () => {
    expect(
      worldToChunkCoordinates(1200, 700, 500)
    ).toEqual({
      x: 2,
      y: 1,
    });
  });

  it("rejects invalid chunk size", () => {
    expect(() =>
      worldToChunkCoordinates(100, 100, 0)
    ).toThrow(
      "Chunk size must be greater than zero."
    );
  });

  
});

describe("getNearbyChunkCoordinates", () => {
  it("returns only the center chunk for radius zero", () => {
    expect(
      getNearbyChunkCoordinates(
        { x: 0, y: 0 },
        0
      )
    ).toEqual([
      { x: 0, y: 0 },
    ]);
  });

  it("returns nine chunks for radius one", () => {
    const result =
      getNearbyChunkCoordinates(
        { x: 0, y: 0 },
        1
      );

    expect(result).toHaveLength(9);
  });

  it("returns twenty-five chunks for radius two", () => {
    const result =
      getNearbyChunkCoordinates(
        { x: 0, y: 0 },
        2
      );

    expect(result).toHaveLength(25);
  });

  it("includes the center chunk", () => {
    const result =
      getNearbyChunkCoordinates(
        { x: 5, y: -3 },
        1
      );

    expect(result).toContainEqual({
      x: 5,
      y: -3,
    });
  });

  it("generates the correct radius-one neighborhood", () => {
    const result =
      getNearbyChunkCoordinates(
        { x: 0, y: 0 },
        1
      );

    expect(result).toEqual([
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },

      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },

      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it("works with negative center coordinates", () => {
    const result =
      getNearbyChunkCoordinates(
        { x: -2, y: -3 },
        1
      );

    expect(result).toEqual([
      { x: -3, y: -4 },
      { x: -2, y: -4 },
      { x: -1, y: -4 },

      { x: -3, y: -3 },
      { x: -2, y: -3 },
      { x: -1, y: -3 },

      { x: -3, y: -2 },
      { x: -2, y: -2 },
      { x: -1, y: -2 },
    ]);
  });

  it("rejects a negative radius", () => {
    expect(() =>
      getNearbyChunkCoordinates(
        { x: 0, y: 0 },
        -1
      )
    ).toThrow(
      "Chunk radius must be a non-negative integer."
    );
  });

  it("rejects a fractional radius", () => {
    expect(() =>
      getNearbyChunkCoordinates(
        { x: 0, y: 0 },
        1.5
      )
    ).toThrow(
      "Chunk radius must be a non-negative integer."
    );
  });
});