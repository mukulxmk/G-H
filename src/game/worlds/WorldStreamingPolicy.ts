import type { Camera } from "@/src/engine/camera/Camera";
import {
  worldToChunkCoordinates,
  type ChunkCoordinates,
} from "./ChunkCoordinates";
import { WorldSpatialRuntime } from "./WorldSpatialRuntime";

export class WorldStreamingPolicy {
  private lastCenterChunk: ChunkCoordinates | null = null;

  constructor(
    private readonly camera: Camera,
    private readonly spatialRuntime: WorldSpatialRuntime,
    private readonly streamingRadius: number
  ) {
    if (
      streamingRadius < 0 ||
      !Number.isInteger(streamingRadius)
    ) {
      throw new Error(
        "Streaming radius must be a non-negative integer."
      );
    }
  }

  update() {
    const centerChunk = this.getCameraChunk();

    if (
      this.lastCenterChunk &&
      this.lastCenterChunk.x === centerChunk.x &&
      this.lastCenterChunk.y === centerChunk.y
    ) {
      return;
    }

    this.spatialRuntime.updateAround(
      centerChunk,
      this.streamingRadius
    );

    this.lastCenterChunk = centerChunk;
  }

  reset() {
    this.lastCenterChunk = null;
  }

  private getCameraChunk(): ChunkCoordinates {
    return worldToChunkCoordinates(
      this.camera.getX(),
      this.camera.getY(),
      this.spatialRuntime.getChunkSize()
    );
  }
}