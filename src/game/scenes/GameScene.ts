import { Renderer } from "@/src/engine/rendering/Renderer";
import { Scene } from "@/src/engine/scenes/Scene";
import { World } from "../worlds/World";

export class GameScene implements Scene {
  constructor(private readonly world: World) {}

  initialize() {
    this.world.initialize();
  }

  update(deltaTime: number) {
    this.world.update(deltaTime);
  }

  render(renderer: Renderer) {
    this.world.render(renderer);
  }

  destroy() {
    this.world.destroy();
  }
}