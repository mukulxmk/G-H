import type { Camera } from "@/src/engine/camera/Camera";
import type { Renderer } from "@/src/engine/rendering/Renderer";
import type { WorldView } from "./WorldView";
import { getCameraWorldViewport } from "./CameraViewportAdapter";

export class WorldViewController {
  constructor(
    private readonly camera: Camera,
    private readonly world: WorldView
  ) {}

  render(renderer: Renderer) {
    const viewport =
      getCameraWorldViewport(this.camera);

    this.world.renderVisible(
      renderer,
      viewport
    );
  }

  destroy() {
    // View controller owns no runtime resources.
  }
}