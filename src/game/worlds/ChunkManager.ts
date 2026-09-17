import { Chunk } from "./Chunks";
import {
  getNearbyChunkCoordinates,
  type ChunkCoordinates,
} from "./ChunkCoordinates";
import { ChunkRuntime } from "./ChunkRuntime";

export class ChunkManager {
  private readonly chunks = new Map<string, Chunk>();
  private readonly runtimes = new  Map<string, ChunkRuntime>();

  constructor(private readonly chunkSize: number) {
    if (chunkSize <= 0) {
      throw new Error(
        "Chunk size must be greater than zero."
      );
    }
  }

  getChunkSize() {
    return this.chunkSize;
  }

  getChunk(coordinates: ChunkCoordinates) {
    return this.chunks.get(
      this.getChunkKey(coordinates)
    );
  }

  getOrCreateChunk(
      coordinates: ChunkCoordinates
  ) {
    const key =
      this.getChunkKey(coordinates);

    const existingChunk =
      this.chunks.get(key);

    if (existingChunk) {
      return existingChunk;
    }

    const chunk = new Chunk(
      coordinates,
      this.chunkSize
    );

    this.chunks.set(key, chunk);

    this.runtimes.set(
      key,
      new ChunkRuntime(chunk)
    );

    return chunk;
  }


  loadChunk(
    coordinates: ChunkCoordinates
  ) {
    const chunk =
      this.getOrCreateChunk(coordinates);

    chunk.load();

    return chunk;
  }

  unloadChunk(
    coordinates: ChunkCoordinates
  ) {
    const chunk =
      this.getChunk(coordinates);

    if (!chunk) {
      return;
    }

    chunk.unload();
  }

  isChunkLoaded(
    coordinates: ChunkCoordinates
  ) {
    return (
      this.getChunk(coordinates)?.isLoaded() ??
      false
    );
  }

  getLoadedChunks() {
    return [...this.chunks.values()].filter(
      (chunk) => chunk.isLoaded()
    );
  }

  getAllChunks() {
    return [...this.chunks.values()];
  }

  unloadAll() {
    for (const chunk of this.chunks.values()) {
      chunk.unload();
    }
  }

  clear() {
    this.chunks.clear();
    this.runtimes.clear();
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

    // Load all required chunks.
    for (const coordinates of requiredCoordinates) {
      this.loadChunk(coordinates);
    }

    // Unload chunks that are no longer required.
    for (const chunk of this.chunks.values()) {
      const key = this.getChunkKey(
        chunk.getCoordinates()
      );

      if (!requiredKeys.has(key)) {
        chunk.unload();
      }
    }
  }

  private getChunkKey(
    coordinates: ChunkCoordinates
  ) {
    return `${coordinates.x}:${coordinates.y}`;
  }

  getChunkRuntime(
    coordinates: ChunkCoordinates
  ) {
    return this.runtimes.get(
      this.getChunkKey(coordinates)
    );
  }
}