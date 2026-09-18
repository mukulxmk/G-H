import type { Renderer } from "@/src/engine/rendering/Renderer";
import type { Bounds } from "./geometry/GeometryBounds";

export interface WorldView {
  renderVisible(
    renderer: Renderer,
    viewport: Bounds
  ): void;
}