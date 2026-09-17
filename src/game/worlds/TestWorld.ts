import type { Renderer } from "@/src/engine/rendering/Renderer";
import type { World } from "./World";
import type { WorldDefinition } from "./WorldDefiniton";
import type { WorldState } from "@/src/game/worlds/WorldState";
import type { Geometry } from "@/src/game/worlds/geometry/Geometry";
import type { WorldElement } from "./elements/WorldElement";
import { testWorldDefinition } from "./TestWorldDefinition";
import { WorldRuntime } from "./WorldRuntime";
export class TestWorld implements World {
  private runtime: WorldRuntime | null = null;

  initialize() {
    const initialState: WorldState = {
      worldId: testWorldDefinition.id,

      elements: [],
    };

    this.runtime = new WorldRuntime(
      testWorldDefinition,
      initialState
    );

    // this.runtime.destroyElement("house-01");
    console.log(this.runtime.getActiveElements());
    

    console.log(
      `TestWorld initialized: ${testWorldDefinition.name}`
    );
    this.runtime.replaceElement("house-01", "house-01-rebuilt")
    console.log(this.runtime.getActiveElements());

  }

  update(_deltaTime: number) {
    // Runtime simulation will come later.
  }

  render(renderer: Renderer) {
    renderer.clear("#4d9bd6");

    if (!this.runtime) return;

    const elements = this.runtime.getActiveElements();

    for (const element of elements) {
      this.renderElement(renderer, element);
    }
  }

  destroy() {
    this.runtime = null;

    console.log("TestWorld destroyed");
  }

  private renderElement(
    renderer: Renderer,
    element: WorldElement
  ) {
    const visual = element.visual;

    const fillColor =
      visual?.fillColor ?? "#ffffff";

    const strokeColor =
      visual?.strokeColor;

    const strokeWidth =
      visual?.strokeWidth ?? 1;

    this.renderGeometry(
      renderer,
      element.geometry,
      fillColor,
      strokeColor,
      strokeWidth
    );
  }

  private renderGeometry(
    renderer: Renderer,
    geometry: Geometry,
    fillColor: string,
    strokeColor: string | undefined,
    strokeWidth: number
  ) {
    switch (geometry.type) {
      case "rectangle":
        renderer.drawRect(
          geometry.x,
          geometry.y,
          geometry.width,
          geometry.height,
          fillColor
        );

        break;

      case "circle":
        renderer.drawCircle(
          geometry.x,
          geometry.y,
          geometry.radius,
          fillColor
        );

        break;

      case "polygon":
        renderer.drawPolygon(
          geometry.points,
          fillColor,
          strokeColor,
          strokeWidth
        );

        break;

      case "path":
        renderer.drawPath(
          geometry.points,
          geometry.width,
          fillColor
        );

        break;
    }
  }
}