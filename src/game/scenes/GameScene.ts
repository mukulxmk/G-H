import type { Renderer } from "@/src/engine/rendering/Renderer";
import type { Scene } from "@/src/engine/scenes/Scene";
import type { World } from "../worlds/World";
import type { WorldViewController } from "../worlds/WorldViewController";
import type {  WorldStreamingPolicy } from "../worlds/WorldStreamingPolicy";

export class GameScene implements Scene {
  private viewController:
    WorldViewController | null = null;
  private streamingPolicy: WorldStreamingPolicy | null = null;

  constructor(
    private readonly world: World,
    private readonly createViewController?: () => WorldViewController
  ) {}

  initialize() {
    this.world.initialize();

    if (this.createViewController) {
      this.viewController =
        this.createViewController();
    }
  }

  update(deltaTime: number) {
    this.world.update(deltaTime);

    this.streamingPolicy?.update();
  }

  render(renderer: Renderer) {
    if (this.viewController) {
      this.viewController.render(renderer);
      return;
    }

    this.world.render(renderer);
  }

  destroy() {
    this.viewController?.destroy();
    this.streamingPolicy?.reset();
    this.world.destroy();
  }
}