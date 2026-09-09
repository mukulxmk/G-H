import type { Renderer } from "@/src/engine/rendering/Renderer";
import { Transform } from "@/src/engine/core/Transform";

export interface Entity {
  readonly transform:  Transform
  initialize(): void;
  update(deltaTime: number): void;
  render(renderer: Renderer): void;
  destroy(): void;
}