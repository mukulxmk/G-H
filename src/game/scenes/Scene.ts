import { Renderer } from "../../engine/rendering/Renderer";

export interface Scene {
  initialize(): void;
  update(deltaTime: number): void;
  render(renderer: Renderer): void;
  destroy(): void;
}