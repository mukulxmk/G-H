import type { ChunkCoordinates } from "./ChunkCoordinates";
import {
  getNearbyChunkCoordinates,
  worldToChunkCoordinates
} from "./ChunkCoordinates";
import { ChunkManager } from "./ChunkManager";
import { WorldSpatialIndex } from "./WorldSpatialIndex";
import { WorldRuntime } from "./WorldRuntime";
import type { WorldElement } from "./elements/WorldElement";
import {
  boundsIntersect,
} from "./geometry/BoundsIntersection";

import {
  getGeometryBounds,
} from "./geometry/GeometryBounds";
import { Bounds } from "./geometry/GeometryBounds";

export class WorldSpatialRuntime {
  constructor(
    private readonly chunkManager: ChunkManager,
    private readonly spatialIndex: WorldSpatialIndex,
    private readonly worldRuntime: WorldRuntime
  ) {}

  loadChunk(coordinates: ChunkCoordinates) {
    const chunk =
      this.chunkManager.loadChunk(coordinates);

    const runtime =
      this.chunkManager.getChunkRuntime(coordinates);

    if (!runtime) {
      throw new Error(
        `Chunk runtime does not exist for ` +
        `chunk "${coordinates.x}:${coordinates.y}".`
      );
    }

    const elementIds =
      this.spatialIndex.getElementIds(coordinates);

    runtime.clear();

    for (const elementId of elementIds) {
      runtime.addElement(elementId);
    }

    return chunk;
  }

  unloadChunk(coordinates: ChunkCoordinates) {
    this.chunkManager.unloadChunk(coordinates);
  }

  updateAround(
    center: ChunkCoordinates,
    radius: number
  ) {
    const requiredCoordinates =
      getNearbyChunkCoordinates(
        center,
        radius
      );

    const requiredKeys = new Set(
      requiredCoordinates.map(
        (coordinates) =>
          this.getChunkKey(coordinates)
      )
    );

    for (const coordinates of requiredCoordinates) {
      this.loadChunk(coordinates);
    }

    for (
      const chunk of this.chunkManager.getLoadedChunks()
    ) {
      const key = this.getChunkKey(
        chunk.getCoordinates()
      );

      if (!requiredKeys.has(key)) {
        this.unloadChunk(
          chunk.getCoordinates()
        );
      }
    }
  }

  getLoadedChunks() {
    return this.chunkManager.getLoadedChunks();
  }

  getChunkRuntime(
    coordinates: ChunkCoordinates
  ) {
    return this.chunkManager.getChunkRuntime(
      coordinates
    );
  }

  getChunkElements(
    coordinates: ChunkCoordinates
  ): WorldElement[] {
    const runtime =
      this.getChunkRuntime(coordinates);

    if (!runtime) {
      return [];
    }

    const elements: WorldElement[] = [];

    for (const elementId of runtime.getElementIds()) {
      const element =
        this.worldRuntime.getElement(
          elementId
        );

      if (!element) {
        throw new Error(
          `Chunk runtime references unknown ` +
          `world element "${elementId}".`
        );
      }

      elements.push(element);
    }

    return elements;
  }

  private getChunkKey(
    coordinates: ChunkCoordinates
  ) {
    return `${coordinates.x}:${coordinates.y}`;
  }

  getActiveElementsAround(
    x: number,
    y: number,
    radius: number
  ): WorldElement[] {
    const center =
        worldToChunkCoordinates(
        x,
        y,
        this.chunkManager.getChunkSize()
        );

    this.updateAround(
        center,
        radius
    );

    const elementsById =
        new Map<string, WorldElement>();

    const nearbyCoordinates =
        getNearbyChunkCoordinates(
        center,
        radius
        );

    for (
        const coordinates of nearbyCoordinates
    ) {
        const elements =
        this.getChunkElements(
            coordinates
        );

        for (const element of elements) {
        elementsById.set(
            element.id,
            element
        );
        }
    }

    return [...elementsById.values()].sort(
        (a, b) => a.zIndex - b.zIndex
    );
  }

  getVisibleElements(
    viewport: Bounds
    ): WorldElement[] {
    const elementsById =
        new Map<string, WorldElement>();

    for (
        const chunk of this.getLoadedChunks()
    ) {
        const coordinates =
        chunk.getCoordinates();

        const elements =
        this.getChunkElements(
            coordinates
        );

        for (const element of elements) {
        if (
            boundsIntersect(
            getGeometryBounds(
                element.geometry
            ),
            viewport
            )
        ) {
            elementsById.set(
            element.id,
            element
            );
        }
        }
    }

    return [...elementsById.values()].sort(
        (a, b) => a.zIndex - b.zIndex
    );
    }
}