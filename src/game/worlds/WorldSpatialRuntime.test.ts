import { describe, expect, it } from "vitest";

import { ChunkManager } from "./ChunkManager";
import {
  WorldSpatialIndex,
} from "./WorldSpatialIndex";
import {
  WorldSpatialRuntime,
} from "./WorldSpatialRuntime";
import {
  WorldRuntime,
} from "./WorldRuntime";
import type { WorldDefinition } from "./WorldDefiniton";
import { testWorldDefinition } from "./TestWorldDefinition"

describe("WorldSpatialRuntime", () => {
  const definition: WorldDefinition = {
    id: "test-world",
    name: "Test World",
    streaming: {
      chunkSize: 500,
      streamingRadius: 1,
    },
    elements: [
      {
        id: "house-01",
        type: "building",
        geometry: {
          type: "rectangle",
          x: 10,
          y: 10,
          width: 20,
          height: 20,
        },
        zIndex: 10,
      },
      {
        id: "road-01",
        type: "road",
        geometry: {
          type: "path",
          points: [
            { x: 0, y: 50 },
            { x: 100, y: 50 },
          ],
          width: 20,
        },
        zIndex: 20,
      },
      {
        id: "river-01",
        type: "water",
        geometry: {
          type: "path",
          points: [
            { x: -150, y: 0 },
            { x: 150, y: 0 },
          ],
          width: 40,
        },
        zIndex: 30,
      },
    ],
  };

  function createRuntime() {
    const chunkManager =
      new ChunkManager(100);

    const spatialIndex =
      new WorldSpatialIndex(100);

    spatialIndex.addWorldDefinition(
      definition
    );

    const worldRuntime =
      new WorldRuntime(
        definition,
        {
          worldId: definition.id,
          elements: [],
        }
      );

    const runtime =
      new WorldSpatialRuntime(
        chunkManager,
        spatialIndex,
        worldRuntime
      );

    return {
      chunkManager,
      spatialIndex,
      worldRuntime,
      runtime,
    };
  }

  it("loads a chunk", () => {
    const { runtime } =
      createRuntime();

    runtime.loadChunk({
      x: 0,
      y: 0,
    });

    expect(
      runtime.getLoadedChunks()
    ).toHaveLength(1);
  });

  it("populates loaded chunk with indexed element ids", () => {
    const { runtime } =
      createRuntime();

    runtime.loadChunk({
      x: 0,
      y: 0,
    });

    const chunkRuntime =
      runtime.getChunkRuntime({
        x: 0,
        y: 0,
      });

    expect(chunkRuntime).toBeDefined();

    expect(
      chunkRuntime?.getElementIds()
    ).toEqual(
      expect.arrayContaining([
        "house-01",
        "road-01",
        "river-01",
      ])
    );
  });

  it("resolves chunk element ids to WorldElement definitions", () => {
    const { runtime } =
      createRuntime();

    runtime.loadChunk({
      x: 0,
      y: 0,
    });

    const elements =
      runtime.getChunkElements({
        x: 0,
        y: 0,
      });

    expect(
      elements.map(
        (element) => element.id
      )
    ).toEqual(
      expect.arrayContaining([
        "house-01",
        "road-01",
        "river-01",
      ])
    );
  });

  it("returns the authoritative WorldElement objects", () => {
    const { runtime, worldRuntime } =
      createRuntime();

    runtime.loadChunk({
      x: 0,
      y: 0,
    });

    const elements =
      runtime.getChunkElements({
        x: 0,
        y: 0,
      });

    const house =
      worldRuntime.getElement(
        "house-01"
      );

    expect(
      elements.find(
        (element) =>
          element.id === "house-01"
      )
    ).toBe(house);
  });

  it("throws when a chunk references a missing world element", () => {
    const {
      runtime,
      chunkManager,
    } = createRuntime();

    runtime.loadChunk({
      x: 0,
      y: 0,
    });

    const chunkRuntime =
      chunkManager.getChunkRuntime({
        x: 0,
        y: 0,
      });

    chunkRuntime?.addElement(
      "missing-element"
    );

    expect(() =>
      runtime.getChunkElements({
        x: 0,
        y: 0,
      })
    ).toThrow(
      'Chunk runtime references unknown world element "missing-element".'
    );
  });

  it("returns an empty array for an unloaded chunk", () => {
    const { runtime } =
      createRuntime();

    expect(
      runtime.getChunkElements({
        x: 99,
        y: 99,
      })
    ).toEqual([]);
  });

  it("does not duplicate elements when a chunk is loaded repeatedly", () => {
    const { runtime } =
      createRuntime();

    const coordinates = {
      x: 0,
      y: 0,
    };

    runtime.loadChunk(coordinates);
    runtime.loadChunk(coordinates);
    runtime.loadChunk(coordinates);

    const elements =
      runtime.getChunkElements(
        coordinates
      );

    expect(elements).toHaveLength(3);
  });

  it("resolves the same world element from multiple chunks", () => {
    const {
      runtime,
      spatialIndex,
    } = createRuntime();

    spatialIndex.addElement(
      definition.elements[2],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ]
    );

    runtime.loadChunk({
      x: 0,
      y: 0,
    });

    runtime.loadChunk({
      x: 1,
      y: 0,
    });

    const firstChunkElements =
      runtime.getChunkElements({
        x: 0,
        y: 0,
      });

    const secondChunkElements =
      runtime.getChunkElements({
        x: 1,
        y: 0,
      });

    const firstRiver =
      firstChunkElements.find(
        (element) =>
          element.id === "river-01"
      );

    const secondRiver =
      secondChunkElements.find(
        (element) =>
          element.id === "river-01"
      );

    expect(firstRiver).toBeDefined();
    expect(secondRiver).toBeDefined();

    expect(firstRiver).toBe(
      secondRiver
    );
  });

  it("keeps one logical element shared across multiple chunks", () => {
    const {
      runtime,
      spatialIndex,
    } = createRuntime();

    const river =
      definition.elements[2];

    spatialIndex.addElement(
      river,
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ]
    );

    runtime.updateAround(
      {
        x: 1,
        y: 0,
      },
      1
    );

    const first =
      runtime.getChunkElements({
        x: 0,
        y: 0,
      });

    const second =
      runtime.getChunkElements({
        x: 1,
        y: 0,
      });

    const third =
      runtime.getChunkElements({
        x: 2,
        y: 0,
      });

    const rivers = [
      ...first,
      ...second,
      ...third,
    ].filter(
      (element) =>
        element.id === "river-01"
    );

    expect(rivers).toHaveLength(3);

    expect(
      rivers[0]
    ).toBe(rivers[1]);

    expect(
      rivers[1]
    ).toBe(rivers[2]);
  });

  it("unloads chunks outside the active region", () => {
    const { runtime } =
      createRuntime();

    runtime.updateAround(
      {
        x: 0,
        y: 0,
      },
      1
    );

    runtime.updateAround(
      {
        x: 5,
        y: 5,
      },
      0
    );

    expect(
      runtime.getLoadedChunks()
    ).toHaveLength(1);

    expect(
      runtime.getLoadedChunks()[0]
        .getCoordinates()
    ).toEqual({
      x: 5,
      y: 5,
    });
  });

  it("finds active elements around a world position", () => {
    const { runtime } =
        createRuntime();

    const elements =
        runtime.getActiveElementsAround(
        20,
        20,
        0
        );

    expect(
        elements.map(
        (element) => element.id
        )
    ).toEqual(
        expect.arrayContaining([
        "house-01",
        "road-01",
        "river-01",
        ])
    );
  });

  it("uses world position to determine the center chunk", () => {
    const { runtime } =
        createRuntime();

    const elements =
        runtime.getActiveElementsAround(
        150,
        50,
        0
        );

    expect(
        elements.map(
        (element) => element.id
        )
    ).toEqual(
        expect.arrayContaining([
        "river-01",
        ])
    );
  });

  it("deduplicates elements shared across multiple chunks", () => {
    const {
        runtime,
        spatialIndex,
    } = createRuntime();

    spatialIndex.addElement(
        definition.elements[2],
        [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        ]
    );

    const elements =
        runtime.getActiveElementsAround(
        100,
        0,
        1
        );

    const rivers =
        elements.filter(
        (element) =>
            element.id === "river-01"
        );

    expect(rivers).toHaveLength(1);
  });

  it("returns active elements sorted by z-index", () => {
    const { runtime } =
        createRuntime();

    const elements =
        runtime.getActiveElementsAround(
        20,
        20,
        1
        );

    for (
        let i = 1;
        i < elements.length;
        i++
    ) {
        expect(
        elements[i].zIndex
        ).toBeGreaterThanOrEqual(
        elements[i - 1].zIndex
        );
    }
  });

  it("loads the required chunks automatically", () => {
    const { runtime } =
        createRuntime();

    runtime.getActiveElementsAround(
        20,
        20,
        1
    );

    expect(
        runtime.getLoadedChunks()
    ).toHaveLength(9);
  });

  it("changes the loaded region when the world position moves", () => {
    const { runtime } =
        createRuntime();

    runtime.getActiveElementsAround(
        20,
        20,
        0
    );

    expect(
        runtime.getLoadedChunks()
    ).toHaveLength(1);

    runtime.getActiveElementsAround(
        520,
        520,
        0
    );

    expect(
        runtime.getLoadedChunks()
    ).toHaveLength(1);

    expect(
        runtime.getLoadedChunks()[0]
        .getCoordinates()
    ).toEqual({
        x: 5,
        y: 5,
    });
  });

  it("returns elements intersecting the viewport", () => {
    const { runtime } =
        createRuntime();

    runtime.loadChunk({
        x: 0,
        y: 0,
    });

    const elements =
        runtime.getVisibleElements({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        });

    expect(
        elements.map(
        (element) => element.id
        )
    ).toEqual(
        expect.arrayContaining([
        "house-01",
        "road-01",
        "river-01",
        ])
    );
  });

  it("excludes elements outside the viewport", () => {
    const { runtime } =
        createRuntime();

    runtime.loadChunk({
        x: 0,
        y: 0,
    });

    const elements =
        runtime.getVisibleElements({
        x: 1000,
        y: 1000,
        width: 100,
        height: 100,
        });

    expect(elements).toEqual([]);
  });

  it("includes elements partially intersecting the viewport", () => {
    const { runtime } =
        createRuntime();

    runtime.loadChunk({
        x: 0,
        y: 0,
    });

    const elements =
        runtime.getVisibleElements({
        x: 90,
        y: 40,
        width: 20,
        height: 20,
        });

    expect(
        elements.some(
        (element) =>
            element.id === "road-01"
        )
    ).toBe(true);
  });

  it("includes elements partially intersecting the viewport", () => {
    const { runtime } =
        createRuntime();

    runtime.loadChunk({
        x: 0,
        y: 0,
    });

    const elements =
        runtime.getVisibleElements({
        x: 90,
        y: 40,
        width: 20,
        height: 20,
        });

    expect(
        elements.some(
        (element) =>
            element.id === "road-01"
        )
    ).toBe(true);
  });

  it("returns visible elements sorted by z-index", () => {
    const { runtime } =
        createRuntime();

    runtime.loadChunk({
        x: 0,
        y: 0,
    });

    const elements =
        runtime.getVisibleElements({
        x: -100,
        y: -100,
        width: 300,
        height: 300,
        });

    for (
        let i = 1;
        i < elements.length;
        i++
    ) {
        expect(
        elements[i].zIndex
        ).toBeGreaterThanOrEqual(
        elements[i - 1].zIndex
        );
    }
  });

  it("streams and resolves visible elements through the complete pipeline", () => {
    const { runtime } =
      createRuntime();

    const elements =
      runtime.getActiveElementsAround(
        20,
        20,
        1
      );

    expect(
      elements.length
    ).toBeGreaterThan(0);

    expect(
      elements.every(
        (element) =>
          typeof element.id === "string"
      )
    ).toBe(true);
  });

  it("does not return elements outside the camera viewport", () => {
  const { runtime } =
    createRuntime();

  const elements =
    runtime.getActiveElementsAround(
      20,
      20,
      1
    );

  const visible =
      elements.filter((element) => {
        const geometry =
          element.geometry;

        if (
          geometry.type !== "rectangle"
        ) {
          return false;
        }

        return (
          geometry.x < 50 &&
          geometry.x +
            geometry.width >
            0
        );
      });

    expect(
      visible.length
    ).toBeGreaterThan(0);
  });

  it("clears spatial runtime data when destroyed", () => {
    const spatialIndex = new WorldSpatialIndex(500);
    const chunkManager = new ChunkManager(500);

    const runtime = new WorldRuntime(
      testWorldDefinition,
      {
        worldId: testWorldDefinition.id,
        elements: [],
      }
    );

    const spatialRuntime = new WorldSpatialRuntime(
      chunkManager,
      spatialIndex,
      runtime
    );

    spatialRuntime.updateAround(
      { x: 0, y: 0 },
      1
    );

    expect(
      spatialRuntime.getLoadedChunks().length
    ).toBeGreaterThan(0);

    spatialRuntime.destroy();

    expect(
      spatialRuntime.getLoadedChunks().length
    ).toBe(0);
  });

  it("clears indexed elements when destroyed", () => {
    const spatialIndex = new WorldSpatialIndex(500);
    const chunkManager = new ChunkManager(500);

    spatialIndex.addWorldDefinition(
      testWorldDefinition
    );

    const runtime = new WorldRuntime(
      testWorldDefinition,
      {
        worldId: testWorldDefinition.id,
        elements: [],
      }
    );

    const spatialRuntime = new WorldSpatialRuntime(
      chunkManager,
      spatialIndex,
      runtime
    );

    expect(
      spatialIndex.getElementIds({ x: 0, y: 0 }).length
    ).toBeGreaterThan(0);

    spatialRuntime.destroy();

    expect(
      spatialIndex.getElementIds({ x: 0, y: 0 }).length
    ).toBe(0);
  });
});