import type { Renderer } from "@/src/engine/rendering/Renderer";
import type { Scene } from "@/src/engine/scenes/Scene";
import type { World } from "../worlds/World";
import type { WorldViewStreamingController } from "../worlds/WorldViewStreamingController";

export class GameScene implements Scene {
  private viewController:
    WorldViewStreamingController | null = null;

  constructor(
    private readonly world: World,
    private readonly createViewController?: () => WorldViewStreamingController
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

    this.viewController?.update();
  }

  render(renderer: Renderer) {
    if (this.viewController) {
      this.viewController.render(renderer);
      return;
    }

    this.world.render(renderer);
  }

  destroy() {
    this.world.destroy();
    this.viewController = null;
  }
}