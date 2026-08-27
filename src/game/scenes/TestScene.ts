import type { Scene } from "./Scene";
import type { Renderer } from "@/src/engine/rendering/Renderer";
import type { World } from "../worlds/World";

export class TestScene implements Scene {
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