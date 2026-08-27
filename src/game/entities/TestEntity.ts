import type { Entity } from "./Entity";
import type { Renderer } from "@/src/engine/rendering/Renderer";

export class TestEntity implements Entity {
  private direction = 1;

  constructor(
    private x: number,
    private readonly y: number,
    private readonly speed: number
  ) {}

  initialize() {
    console.log("TestEntity initialized");
  }

  update(deltaTime: number) {
    const deltaSeconds = deltaTime / 1000;

    this.x += this.speed * this.direction * deltaSeconds;

    if (this.x > 500) {
      this.direction = -1;
    }

    if (this.x < 100) {
      this.direction = 1;
    }
  }

  render(renderer: Renderer) {
    renderer.drawCircle(this.x, this.y, 20, "#22c55e");
  }

  destroy() {
    console.log("TestEntity destroyed");
  }
}