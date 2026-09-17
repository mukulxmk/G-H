import { describe, expect, it } from "vitest";

import { ChunkManager } from "./ChunkManager";

describe("ChunkManager", () => {
  it("stores the configured chunk size", () => {
    const manager = new ChunkManager(1000);

    expect(manager.getChunkSize()).toBe(1000);
  });

  it("starts with no chunks", () => {
    const manager = new ChunkManager(1000);

    expect(manager.getAllChunks()).toEqual([]);
    expect(manager.getLoadedChunks()).toEqual([]);
  });

  it("creates a chunk when requested", () => {
    const manager = new ChunkManager(1000);

    const chunk = manager.getOrCreateChunk({
      x: 2,
      y: -1,
    });

    expect(chunk.getCoordinates()).toEqual({
      x: 2,
      y: -1,
    });

    expect(manager.getAllChunks()).toHaveLength(1);
  });

  it("returns the existing chunk instead of creating a duplicate", () => {
    const manager = new ChunkManager(1000);

    const first = manager.getOrCreateChunk({
      x: 2,
      y: -1,
    });

    const second = manager.getOrCreateChunk({
      x: 2,
      y: -1,
    });

    expect(second).toBe(first);
    expect(manager.getAllChunks()).toHaveLength(1);
  });

  it("finds an existing chunk", () => {
    const manager = new ChunkManager(1000);

    const created = manager.getOrCreateChunk({
      x: -3,
      y: 4,
    });

    const found = manager.getChunk({
      x: -3,
      y: 4,
    });

    expect(found).toBe(created);
  });

  it("returns undefined for a chunk that does not exist", () => {
    const manager = new ChunkManager(1000);

    expect(
      manager.getChunk({
        x: 10,
        y: 10,
      })
    ).toBeUndefined();
  });

  it("loads a chunk", () => {
    const manager = new ChunkManager(1000);

    const chunk = manager.loadChunk({
      x: 1,
      y: 2,
    });

    expect(chunk.isLoaded()).toBe(true);

    expect(
      manager.isChunkLoaded({
        x: 1,
        y: 2,
      })
    ).toBe(true);
  });

  it("creates and loads a chunk in one operation", () => {
    const manager = new ChunkManager(1000);

    manager.loadChunk({
      x: -2,
      y: -3,
    });

    expect(manager.getAllChunks()).toHaveLength(1);
    expect(manager.getLoadedChunks()).toHaveLength(1);
  });

  it("unloads an existing chunk", () => {
    const manager = new ChunkManager(1000);

    manager.loadChunk({
      x: 1,
      y: 1,
    });

    manager.unloadChunk({
      x: 1,
      y: 1,
    });

    expect(
      manager.isChunkLoaded({
        x: 1,
        y: 1,
      })
    ).toBe(false);

    expect(manager.getAllChunks()).toHaveLength(1);
    expect(manager.getLoadedChunks()).toHaveLength(0);
  });

  it("does nothing when unloading a missing chunk", () => {
    const manager = new ChunkManager(1000);

    expect(() =>
      manager.unloadChunk({
        x: 99,
        y: 99,
      })
    ).not.toThrow();

    expect(manager.getAllChunks()).toHaveLength(0);
  });

  it("returns only loaded chunks", () => {
    const manager = new ChunkManager(1000);

    manager.loadChunk({
      x: 0,
      y: 0,
    });

    manager.loadChunk({
      x: 1,
      y: 0,
    });

    manager.getOrCreateChunk({
      x: 2,
      y: 0,
    });

    const loaded =
      manager.getLoadedChunks();

    expect(loaded).toHaveLength(2);

    expect(
      loaded.map((chunk) =>
        chunk.getCoordinates()
      )
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]);
  });

  it("unloads all chunks", () => {
    const manager = new ChunkManager(1000);

    manager.loadChunk({
      x: 0,
      y: 0,
    });

    manager.loadChunk({
      x: 1,
      y: 0,
    });

    manager.loadChunk({
      x: 0,
      y: 1,
    });

    manager.unloadAll();

    expect(manager.getLoadedChunks()).toEqual([]);
    expect(manager.getAllChunks()).toHaveLength(3);
  });

  it("clears all chunks", () => {
    const manager = new ChunkManager(1000);

    manager.loadChunk({
      x: 0,
      y: 0,
    });

    manager.loadChunk({
      x: 1,
      y: 1,
    });

    manager.clear();

    expect(manager.getAllChunks()).toEqual([]);
    expect(manager.getLoadedChunks()).toEqual([]);
  });

  it("treats negative coordinates as distinct chunks", () => {
    const manager = new ChunkManager(1000);

    const negative = manager.getOrCreateChunk({
      x: -1,
      y: -1,
    });

    const positive = manager.getOrCreateChunk({
      x: 1,
      y: 1,
    });

    expect(negative).not.toBe(positive);
    expect(manager.getAllChunks()).toHaveLength(2);
  });

  it("rejects an invalid chunk size", () => {
    expect(
      () => new ChunkManager(0)
    ).toThrow(
      "Chunk size must be greater than zero."
    );
  });

  it("rejects a negative chunk size", () => {
    expect(
      () => new ChunkManager(-100)
    ).toThrow(
      "Chunk size must be greater than zero."
    );
  });
});

describe("updateAround", () => {
  it("loads the center chunk with radius zero", () => {
    const manager = new ChunkManager(1000);

    manager.updateAround(
      { x: 0, y: 0 },
      0
    );

    expect(manager.getLoadedChunks())
      .toHaveLength(1);

    expect(
      manager.isChunkLoaded({
        x: 0,
        y: 0,
      })
    ).toBe(true);
  });

  it("loads nine chunks with radius one", () => {
    const manager = new ChunkManager(1000);

    manager.updateAround(
      { x: 0, y: 0 },
      1
    );

    expect(
      manager.getLoadedChunks()
    ).toHaveLength(9);
  });

  it("unloads chunks outside the new region", () => {
    const manager = new ChunkManager(1000);

    manager.updateAround(
      { x: 0, y: 0 },
      1
    );

    manager.updateAround(
      { x: 5, y: 5 },
      0
    );

    expect(
      manager.getLoadedChunks()
    ).toHaveLength(1);

    expect(
      manager.isChunkLoaded({
        x: 5,
        y: 5,
      })
    ).toBe(true);

    expect(
      manager.isChunkLoaded({
        x: 0,
        y: 0,
      })
    ).toBe(false);
  });

  it("reuses existing chunks when the region changes", () => {
    const manager = new ChunkManager(1000);

    const original =
      manager.getOrCreateChunk({
        x: 0,
        y: 0,
      });

    manager.updateAround(
      { x: 0, y: 0 },
      1
    );

    const reused =
      manager.getChunk({
        x: 0,
        y: 0,
      });

    expect(reused).toBe(original);
  });

  it("does not create duplicate chunks when updated repeatedly", () => {
    const manager = new ChunkManager(1000);

    manager.updateAround(
      { x: 0, y: 0 },
      1
    );

    manager.updateAround(
      { x: 0, y: 0 },
      1
    );

    expect(
      manager.getAllChunks()
    ).toHaveLength(9);
  });

  it("loads newly required chunks", () => {
    const manager = new ChunkManager(1000);

    manager.updateAround(
      { x: 0, y: 0 },
      0
    );

    manager.updateAround(
      { x: 1, y: 0 },
      0
    );

    expect(
      manager.isChunkLoaded({
        x: 0,
        y: 0,
      })
    ).toBe(false);

    expect(
      manager.isChunkLoaded({
        x: 1,
        y: 0,
      })
    ).toBe(true);
  });

  it("keeps previously created chunks for reuse", () => {
    const manager = new ChunkManager(1000);

    manager.updateAround(
      { x: 0, y: 0 },
      0
    );

    manager.updateAround(
      { x: 1, y: 0 },
      0
    );

    expect(
      manager.getAllChunks()
    ).toHaveLength(2);

    expect(
      manager.getLoadedChunks()
    ).toHaveLength(1);
  });

  it("works with negative coordinates", () => {
    const manager = new ChunkManager(1000);

    manager.updateAround(
      { x: -2, y: -3 },
      1
    );

    expect(
      manager.getLoadedChunks()
    ).toHaveLength(9);

    expect(
      manager.isChunkLoaded({
        x: -2,
        y: -3,
      })
    ).toBe(true);
  });

  it("rejects an invalid radius", () => {
    const manager = new ChunkManager(1000);

    expect(() =>
      manager.updateAround(
        { x: 0, y: 0 },
        -1
      )
    ).toThrow(
      "Chunk radius must be a non-negative integer."
    );
  });
});

describe("chunk runtime", () => {
  it("creates a runtime when a chunk is created", () => {
    const manager =
      new ChunkManager(1000);

    manager.getOrCreateChunk({
      x: 2,
      y: -1,
    });

    const runtime =
      manager.getChunkRuntime({
        x: 2,
        y: -1,
      });

    expect(runtime).toBeDefined();
    expect(
      runtime?.getChunk()
        .getCoordinates()
    ).toEqual({
      x: 2,
      y: -1,
    });
  });

  it("returns the same runtime for the same chunk", () => {
    const manager =
      new ChunkManager(1000);

    manager.getOrCreateChunk({
      x: 1,
      y: 1,
    });

    const first =
      manager.getChunkRuntime({
        x: 1,
        y: 1,
      });

    const second =
      manager.getChunkRuntime({
        x: 1,
        y: 1,
      });

    expect(second).toBe(first);
  });

  it("returns undefined for a runtime that does not exist", () => {
    const manager =
      new ChunkManager(1000);

    expect(
      manager.getChunkRuntime({
        x: 10,
        y: 10,
      })
    ).toBeUndefined();
  });

  it("clears chunk runtimes with chunks", () => {
    const manager =
      new ChunkManager(1000);

    manager.getOrCreateChunk({
      x: 0,
      y: 0,
    });

    manager.clear();

    expect(
      manager.getChunkRuntime({
        x: 0,
        y: 0,
      })
    ).toBeUndefined();
  });
});