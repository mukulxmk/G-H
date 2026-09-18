import type { ChunkCoordinates } from "./ChunkCoordinates";
import type { WorldDefinition } from "./WorldDefiniton";
import type { WorldElement } from "./elements/WorldElement";
import {
  getChunksForBounds,
} from "./geometry/BoundsToChunks";
import {
  getGeometryBounds,
} from "./geometry/GeometryBounds";
import { Bounds } from "./geometry/GeometryBounds";

export class WorldSpatialIndex {
  private readonly elementsByChunk =
    new Map<string, Set<string>>();

  private readonly elementChunks =
    new Map<string, Set<string>>();

  constructor(
    private readonly chunkSize: number
  ) {
    if (chunkSize <= 0) {
      throw new Error(
        "Chunk size must be greater than zero."
      );
    }
  }

  addElement(
    element: WorldElement,
    chunks: ChunkCoordinates[]
  ) {
    this.removeElement(element.id);

    const chunkKeys = new Set<string>();

    for (const coordinates of chunks) {
      const key =
        this.getChunkKey(coordinates);

      let elementIds =
        this.elementsByChunk.get(key);

      if (!elementIds) {
        elementIds = new Set<string>();

        this.elementsByChunk.set(
          key,
          elementIds
        );
      }

      elementIds.add(element.id);
      chunkKeys.add(key);
    }

    this.elementChunks.set(
      element.id,
      chunkKeys
    );
  }

  addElementAutomatically(
    element: WorldElement
  ) {
    const bounds =
      getGeometryBounds(element.geometry);

    const chunks =
      getChunksForBounds(
        bounds,
        this.chunkSize
      );

    this.addElement(
      element,
      chunks
    );
  }

  addWorldDefinition(
    definition: WorldDefinition
  ) {
    for (const element of definition.elements) {
      this.addElementAutomatically(element);
    }
  }

  removeElement(elementId: string) {
    const chunkKeys =
      this.elementChunks.get(elementId);

    if (!chunkKeys) {
      return;
    }

    for (const key of chunkKeys) {
      const elementIds =
        this.elementsByChunk.get(key);

      if (!elementIds) {
        continue;
      }

      elementIds.delete(elementId);

      if (elementIds.size === 0) {
        this.elementsByChunk.delete(key);
      }
    }

    this.elementChunks.delete(elementId);
  }

  getElementIds(
    coordinates: ChunkCoordinates
  ) {
    const elementIds =
      this.elementsByChunk.get(
        this.getChunkKey(coordinates)
      );

    if (!elementIds) {
      return [];
    }

    return [...elementIds];
  }

  getChunkCoordinates(
    elementId: string
  ) {
    const keys =
      this.elementChunks.get(elementId);

    if (!keys) {
      return [];
    }

    return [...keys].map(
      (key) => this.parseChunkKey(key)
    );
  }

  clear() {
    this.elementsByChunk.clear();
    this.elementChunks.clear();
  }

  private getChunkKey(
    coordinates: ChunkCoordinates
  ) {
    return `${coordinates.x}:${coordinates.y}`;
  }

  private parseChunkKey(
    key: string
  ): ChunkCoordinates {
    const [x, y] = key.split(":");

    return {
      x: Number(x),
      y: Number(y),
    };
  }

  getElementIdsForBounds(
    bounds: Bounds
  ): string[] {
    const chunks =
      getChunksForBounds(
        bounds,
        this.chunkSize
      );

    const elementIds = new Set<string>();

    for (const coordinates of chunks) {
      const ids =
        this.getElementIds(coordinates);

      for (const id of ids) {
        elementIds.add(id);
      }
    }

    return [...elementIds];
  }
}