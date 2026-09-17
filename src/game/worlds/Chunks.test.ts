import { describe, expect, it } from "vitest";

import { Chunk } from "./Chunks";

describe("Chunk", () => {
  it("stores chunk coordinates", () => {
    const chunk = new Chunk(
      { x: 2, y: -3 },
      1000
    );

    expect(chunk.getCoordinates()).toEqual({
      x: 2,
      y: -3,
    });
  });

  it("stores chunk size", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      500
    );

    expect(chunk.getSize()).toBe(500);
  });

  it("calculates world bounds", () => {
    const chunk = new Chunk(
      { x: 2, y: -3 },
      1000
    );

    expect(chunk.getWorldBounds()).toEqual({
      x: 2000,
      y: -3000,
      width: 1000,
      height: 1000,
    });
  });

  it("calculates negative chunk bounds correctly", () => {
    const chunk = new Chunk(
      { x: -2, y: -3 },
      500
    );

    expect(chunk.getWorldBounds()).toEqual({
      x: -1000,
      y: -1500,
      width: 500,
      height: 500,
    });
  });

  it("starts unloaded", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    expect(chunk.isLoaded()).toBe(false);
  });

  it("can be loaded", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    chunk.load();

    expect(chunk.isLoaded()).toBe(true);
  });

  it("can be unloaded", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    chunk.load();
    chunk.unload();

    expect(chunk.isLoaded()).toBe(false);
  });

  it("rejects non-integer x coordinates", () => {
    expect(
      () =>
        new Chunk(
          { x: 1.5, y: 0 },
          1000
        )
    ).toThrow(
      "Chunk x coordinate must be an integer."
    );
  });

  it("rejects non-integer y coordinates", () => {
    expect(
      () =>
        new Chunk(
          { x: 0, y: 1.5 },
          1000
        )
    ).toThrow(
      "Chunk y coordinate must be an integer."
    );
  });

  it("rejects invalid chunk size", () => {
    expect(
      () =>
        new Chunk(
          { x: 0, y: 0 },
          0
        )
    ).toThrow(
      "Chunk size must be greater than zero."
    );
  });
});