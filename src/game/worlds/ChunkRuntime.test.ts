import {
  describe,
  expect,
  it,
} from "vitest";

import { Chunk } from "./Chunks";
import { ChunkRuntime } from "./ChunkRuntime";

describe("ChunkRuntime", () => {
  it("references its chunk", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    const runtime =
      new ChunkRuntime(chunk);

    expect(runtime.getChunk()).toBe(chunk);
  });

  it("starts with no elements", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    const runtime =
      new ChunkRuntime(chunk);

    expect(
      runtime.getElementIds()
    ).toEqual([]);
  });

  it("adds an element ID", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    const runtime =
      new ChunkRuntime(chunk);

    runtime.addElement("house-01");

    expect(
      runtime.getElementIds()
    ).toEqual(["house-01"]);
  });

  it("does not duplicate an element ID", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    const runtime =
      new ChunkRuntime(chunk);

    runtime.addElement("house-01");
    runtime.addElement("house-01");

    expect(
      runtime.getElementIds()
    ).toEqual(["house-01"]);
  });

  it("checks whether an element is present", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    const runtime =
      new ChunkRuntime(chunk);

    runtime.addElement("house-01");

    expect(
      runtime.hasElement("house-01")
    ).toBe(true);

    expect(
      runtime.hasElement("house-02")
    ).toBe(false);
  });

  it("removes an element ID", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    const runtime =
      new ChunkRuntime(chunk);

    runtime.addElement("house-01");
    runtime.addElement("house-02");

    runtime.removeElement("house-01");

    expect(
      runtime.getElementIds()
    ).toEqual(["house-02"]);
  });

  it("clears all element IDs", () => {
    const chunk = new Chunk(
      { x: 0, y: 0 },
      1000
    );

    const runtime =
      new ChunkRuntime(chunk);

    runtime.addElement("house-01");
    runtime.addElement("house-02");

    runtime.clear();

    expect(
      runtime.getElementIds()
    ).toEqual([]);
  });
});