import type { Renderer } from "@/src/engine/rendering/Renderer";
import type { World } from "./World";
import type { WorldState } from "@/src/game/worlds/WorldState";
import type { Geometry } from "@/src/game/worlds/geometry/Geometry";
import type { WorldElement } from "./elements/WorldElement";
import { testWorldDefinition } from "./TestWorldDefinition";
import { WorldRuntime } from "./WorldRuntime";
import { WorldSpatialIndex } from "./WorldSpatialIndex";
import { ChunkManager } from "./ChunkManager";
import { WorldSpatialRuntime } from "./WorldSpatialRuntime";
import { WorldView } from "./WorldView";
import type { Bounds } from "./geometry/GeometryBounds";
import { Camera } from "@/src/engine/camera/Camera";
import { WorldViewStreamingController } from "./WorldViewStreamingController";

export class TestWorld implements World, WorldView {
  private runtime: WorldRuntime | null = null;

  private spatialRuntime:
    WorldSpatialRuntime | null = null;

 initialize() {
    const initialState: WorldState = {
      worldId: testWorldDefinition.id,
      elements: [],
    };

    this.runtime = new WorldRuntime(
      testWorldDefinition,
      initialState
    );

    const spatialIndex =
      new WorldSpatialIndex(500);

    spatialIndex.addWorldDefinition(
      testWorldDefinition
    );

    const chunkManager =
      new ChunkManager(500);

    this.spatialRuntime =
      new WorldSpatialRuntime(
        chunkManager,
        spatialIndex,
        this.runtime
      );

    console.log(
      `TestWorld initialized: ${testWorldDefinition.name}`
    );
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

  renderViewport(
    renderer: Renderer,
    viewport: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  ) {
    renderer.clear("#4d9bd6");

    if (!this.spatialRuntime) {
      return;
    }

    const elements =
      this.spatialRuntime.getVisibleElements(
        viewport
      );

    for (const element of elements) {
      this.renderElement(
        renderer,
        element
      );
    }
  }

  renderVisible(
    renderer: Renderer,
    viewport: Bounds
  ) {
    renderer.clear("#4d9bd6");

    if (!this.spatialRuntime) {
      return;
    }

    const elements =
      this.spatialRuntime.getVisibleElements(viewport);

    for (const element of elements) {
      this.renderElement(renderer, element);
    }
  }

  createViewController(
    camera: Camera,
    streamingRadius: number
  ) {
    if (!this.spatialRuntime) {
      throw new Error(
        "TestWorld must be initialized before creating its view controller."
      );
    }

    return new WorldViewStreamingController(
      camera,
      this,
      this.spatialRuntime,
      streamingRadius
    );
  }
}