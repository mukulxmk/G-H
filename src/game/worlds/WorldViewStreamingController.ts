import { Camera } from "@/src/engine/camera/Camera";
import { Renderer } from "@/src/engine/rendering/Renderer";

import {
  worldToChunkCoordinates, ChunkCoordinates
} from "./ChunkCoordinates";

import type { WorldView } from "./WorldView";

import {
  WorldSpatialRuntime,
} from "./WorldSpatialRuntime";

import {
  getCameraWorldViewport,
} from "./CameraViewportAdapter";

export class WorldViewStreamingController {
  private lastCenterChunk: ChunkCoordinates | null = null;

  constructor(
    private readonly camera: Camera,
    private readonly world: WorldView,
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
    const centerChunk =
      this.getCameraChunk();

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

  render(renderer: Renderer) {
    const viewport =
      getCameraWorldViewport(
        this.camera
      );

    this.world.renderVisible(
      renderer,
      viewport
    );
  }

  updateAndRender(
    renderer: Renderer
  ) {
    this.update();
    this.render(renderer);
  }

  private getCameraChunk() {
    return worldToChunkCoordinates(
      this.camera.getX(),
      this.camera.getY(),
      this.spatialRuntime.getChunkSize()
    );
  }
}