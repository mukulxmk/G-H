import { describe, expect, it } from "vitest";

import { WorldSpatialIndex } from "./WorldSpatialIndex";
import type { WorldElement } from "./elements/WorldElement";

const createElement = (
  id: string
): WorldElement => ({
  id,
  type: "decoration",

  geometry: {
    type: "circle",
    x: 0,
    y: 0,
    radius: 10,
  },

  zIndex: 1,
});

describe("WorldSpatialIndex", () => {
  it("starts empty", () => {
    const index =
      new WorldSpatialIndex(1000);

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual([]);
  });

  it("adds an element to a chunk", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element =
      createElement("tree-01");

    index.addElement(element, [
      { x: 0, y: 0 },
    ]);

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual(["tree-01"]);
  });

  it("adds one element to multiple chunks", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element =
      createElement("river-01");

    index.addElement(element, [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]);

    expect(
      index.getElementIds({
        x: -1,
        y: 0,
      })
    ).toEqual(["river-01"]);

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual(["river-01"]);

    expect(
      index.getElementIds({
        x: 1,
        y: 0,
      })
    ).toEqual(["river-01"]);
  });

  it("does not duplicate an element within the same chunk", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element =
      createElement("tree-01");

    index.addElement(element, [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]);

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual(["tree-01"]);
  });

  it("returns chunks containing an element", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element =
      createElement("river-01");

    index.addElement(element, [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ]);

    expect(
      index.getChunkCoordinates(
        "river-01"
      )
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it("returns an empty array for an unknown element", () => {
    const index =
      new WorldSpatialIndex(1000);

    expect(
      index.getChunkCoordinates(
        "does-not-exist"
      )
    ).toEqual([]);
  });

  it("removes an element from all chunks", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element =
      createElement("river-01");

    index.addElement(element, [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]);

    index.removeElement("river-01");

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual([]);

    expect(
      index.getElementIds({
        x: 1,
        y: 0,
      })
    ).toEqual([]);

    expect(
      index.getChunkCoordinates(
        "river-01"
      )
    ).toEqual([]);
  });

  it("replaces an existing element index", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element =
      createElement("tree-01");

    index.addElement(element, [
      { x: 0, y: 0 },
    ]);

    index.addElement(element, [
      { x: 2, y: 2 },
    ]);

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual([]);

    expect(
      index.getElementIds({
        x: 2,
        y: 2,
      })
    ).toEqual(["tree-01"]);
  });

  it("keeps different elements separate", () => {
    const index =
      new WorldSpatialIndex(1000);

    index.addElement(
      createElement("tree-01"),
      [{ x: 0, y: 0 }]
    );

    index.addElement(
      createElement("tree-02"),
      [{ x: 0, y: 0 }]
    );

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual([
      "tree-01",
      "tree-02",
    ]);
  });

  it("clears the entire index", () => {
    const index =
      new WorldSpatialIndex(1000);

    index.addElement(
      createElement("tree-01"),
      [{ x: 0, y: 0 }]
    );

    index.addElement(
      createElement("tree-02"),
      [{ x: 1, y: 1 }]
    );

    index.clear();

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual([]);

    expect(
      index.getElementIds({
        x: 1,
        y: 1,
      })
    ).toEqual([]);
  });

  it("rejects an invalid chunk size", () => {
    expect(
      () => new WorldSpatialIndex(0)
    ).toThrow(
      "Chunk size must be greater than zero."
    );
  });
});

describe("automatic world indexing", () => {
  it("automatically determines the chunk for an element", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element: WorldElement = {
      id: "house-01",
      type: "building",

      geometry: {
        type: "rectangle",
        x: 100,
        y: 200,
        width: 200,
        height: 200,
      },

      zIndex: 10,
    };

    index.addElementAutomatically(
      element
    );

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual(["house-01"]);
  });

  it("automatically indexes an element across multiple chunks", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element: WorldElement = {
      id: "road-01",
      type: "road",

      geometry: {
        type: "path",

        points: [
          { x: -1500, y: 0 },
          { x: 1500, y: 0 },
        ],

        width: 100,
      },

      zIndex: 10,
    };

    index.addElementAutomatically(
      element
    );

    expect(
      index.getChunkCoordinates(
        "road-01"
      )
    ).toEqual([
      { x: -2, y: -1 },
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: 2, y: -1 },
    ]);
  });

  it("automatically indexes polygons", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element: WorldElement = {
      id: "mountain-01",
      type: "mountain",

      geometry: {
        type: "polygon",

        points: [
          { x: 900, y: 900 },
          { x: 1200, y: 900 },
          { x: 1200, y: 1200 },
          { x: 900, y: 1200 },
        ],
      },

      zIndex: 10,
    };

    index.addElementAutomatically(
      element
    );

    expect(
      index.getChunkCoordinates(
        "mountain-01"
      )
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it("indexes an entire world definition", () => {
    const index =
      new WorldSpatialIndex(1000);

    const definition: WorldDefinition = {
      id: "test-world",
      name: "Test World",

      elements: [
        {
          id: "house-01",
          type: "building",

          geometry: {
            type: "rectangle",
            x: 100,
            y: 100,
            width: 200,
            height: 200,
          },

          zIndex: 10,
        },

        {
          id: "house-02",
          type: "building",

          geometry: {
            type: "rectangle",
            x: 1200,
            y: 100,
            width: 200,
            height: 200,
          },

          zIndex: 10,
        },
      ],
    };

    index.addWorldDefinition(
      definition
    );

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual(["house-01"]);

    expect(
      index.getElementIds({
        x: 1,
        y: 0,
      })
    ).toEqual(["house-02"]);
  });

  it("rebuilding an element index replaces its previous spatial membership", () => {
    const index =
      new WorldSpatialIndex(1000);

    const element: WorldElement = {
      id: "house-01",
      type: "building",

      geometry: {
        type: "rectangle",
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      },

      zIndex: 10,
    };

    index.addElementAutomatically(
      element
    );

    element.geometry = {
      type: "rectangle",
      x: 2100,
      y: 100,
      width: 100,
      height: 100,
    };

    index.addElementAutomatically(
      element
    );

    expect(
      index.getElementIds({
        x: 0,
        y: 0,
      })
    ).toEqual([]);

    expect(
      index.getElementIds({
        x: 2,
        y: 0,
      })
    ).toEqual(["house-01"]);
  });
});