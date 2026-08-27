import type { Renderer } from "@/src/engine/rendering/Renderer";

export interface Entity {
  initialize(): void;
  update(deltaTime: number): void;
  render(renderer: Renderer): void;
  destroy(): void;
}