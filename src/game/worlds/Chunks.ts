import type { ChunkCoordinates } from "./ChunkCoordinates";

export class Chunk {
  private loaded = false;

  constructor(
    private readonly coordinates: ChunkCoordinates,
    private readonly size: number
  ) {
    if (!Number.isInteger(coordinates.x)) {
      throw new Error(
        "Chunk x coordinate must be an integer."
      );
    }

    if (!Number.isInteger(coordinates.y)) {
      throw new Error(
        "Chunk y coordinate must be an integer."
      );
    }

    if (size <= 0) {
      throw new Error(
        "Chunk size must be greater than zero."
      );
    }
  }

  getCoordinates() {
    return this.coordinates;
  }

  getSize() {
    return this.size;
  }

  getWorldBounds() {
    return {
      x: this.coordinates.x * this.size,
      y: this.coordinates.y * this.size,
      width: this.size,
      height: this.size,
    };
  }

  isLoaded() {
    return this.loaded;
  }

  load() {
    this.loaded = true;
  }

  unload() {
    this.loaded = false;
  }
}