import type { Renderer } from "@/src/engine/rendering/Renderer";

export interface World {
  initialize(): void;
  update(deltaTime: number): void;
  render(renderer: Renderer): void;
  destroy(): void;
}