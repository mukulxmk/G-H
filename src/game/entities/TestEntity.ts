import type { Renderer } from "@/src/engine/rendering/Renderer";
import type { Entity } from "@/src/engine/entity/Entity";
import { Input } from "@/src/engine/input/Input";
import { Transform } from "@/src/engine/core/Transform";
import { TestComponent } from "../components/TestComponent";

export class TestEntity implements Entity {
  // private x: number;
  // private y: number;
  readonly transform = new Transform();
  readonly testComponent = new TestComponent();

  private readonly speed: number;
  private readonly input: Input;
  private readonly color: string;

  constructor(
    x: number,
    y: number,
    speed: number,
    input: Input,
    color?: string
  ) {
    this.transform.x = x;
    this.transform.y = y;
    this.speed = speed;
    this.input = input;
    this.color = color || "#8d2929";
  }

  initialize() {}

  update(deltaTime: number) {
    let directionX = 0;
    let directionY = 0;

    if (this.input.isKeyDown("w")) {
      directionY -= 1;
    }

    if (this.input.isKeyDown("s")) {
      directionY += 1;
    }

    if (this.input.isKeyDown("a")) {
      directionX -= 1;
    }

    if (this.input.isKeyDown("d")) {
      directionX += 1;
    }

    this.transform.x += directionX * this.speed * deltaTime / 1000;
    this.transform.y += directionY * this.speed * deltaTime / 1000;
  }

  render(renderer: Renderer) {
    renderer.drawCircle(
      this.transform.x,
      this.transform.y,
      20,
      this.color
    );
  }

  destroy() {
    console.log("Entity Destroyed.")
  }

  getPosition() {
    return this.transform.getPosition();
  }
}