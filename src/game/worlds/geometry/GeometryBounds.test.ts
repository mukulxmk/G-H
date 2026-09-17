import { describe, expect, it } from "vitest";

import {
  getGeometryBounds,
} from "./GeometryBounds";

describe("getGeometryBounds", () => {
  it("returns rectangle bounds", () => {
    expect(
      getGeometryBounds({
        type: "rectangle",
        x: 100,
        y: 200,
        width: 300,
        height: 150,
      })
    ).toEqual({
      x: 100,
      y: 200,
      width: 300,
      height: 150,
    });
  });

  it("returns circle bounds", () => {
    expect(
      getGeometryBounds({
        type: "circle",
        x: 100,
        y: 200,
        radius: 50,
      })
    ).toEqual({
      x: 50,
      y: 150,
      width: 100,
      height: 100,
    });
  });

  it("returns polygon bounds", () => {
    expect(
      getGeometryBounds({
        type: "polygon",
        points: [
          { x: -100, y: 50 },
          { x: 200, y: -50 },
          { x: 150, y: 300 },
          { x: -50, y: 100 },
        ],
      })
    ).toEqual({
      x: -100,
      y: -50,
      width: 300,
      height: 350,
    });
  });

  it("returns path bounds including width", () => {
    expect(
      getGeometryBounds({
        type: "path",
        points: [
          { x: 0, y: 0 },
          { x: 1000, y: 500 },
        ],
        width: 100,
      })
    ).toEqual({
      x: -50,
      y: -50,
      width: 1100,
      height: 600,
    });
  });

  it("handles negative coordinates", () => {
    expect(
      getGeometryBounds({
        type: "rectangle",
        x: -500,
        y: -300,
        width: 200,
        height: 100,
      })
    ).toEqual({
      x: -500,
      y: -300,
      width: 200,
      height: 100,
    });
  });

  it("handles a single polygon point", () => {
    expect(
      getGeometryBounds({
        type: "polygon",
        points: [
          { x: 100, y: 200 },
        ],
      })
    ).toEqual({
      x: 100,
      y: 200,
      width: 0,
      height: 0,
    });
  });

  it("handles empty polygon geometry", () => {
    expect(
      getGeometryBounds({
        type: "polygon",
        points: [],
      })
    ).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  });

  it("handles empty path geometry", () => {
    expect(
      getGeometryBounds({
        type: "path",
        points: [],
        width: 100,
      })
    ).toEqual({
      x: -50,
      y: -50,
      width: 100,
      height: 100,
    });
  });
});