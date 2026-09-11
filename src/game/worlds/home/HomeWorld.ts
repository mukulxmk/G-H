import { Renderer } from "@/src/engine/rendering/Renderer";
import type { World } from "../World";
import { homeWorldData } from "./HomeWorldData";

export class HomeWorld implements World {
  initialize() {
    console.log("HomeWorld initialized");
  }

  update(_deltaTime: number) {
    // World simulation will come later.
  }

  render(renderer: Renderer) {
    renderer.clear("#4d9bd6");

    this.renderIsland(renderer);
    this.renderRoads(renderer);
    this.renderBuildings(renderer);
    this.renderPlantation(renderer);
    this.renderTrees(renderer);
  }

  destroy() {
    console.log("HomeWorld destroyed");
  }

  private renderIsland(renderer: Renderer) {
    const island = homeWorldData.island;

    renderer.drawRect(
      island.x,
      island.y,
      island.width,
      island.height,
      "#6fa85f"
    );
  }

  private renderRoads(renderer: Renderer) {
    for (const road of homeWorldData.roads) {
      renderer.drawLine(
        road.start.x,
        road.start.y,
        road.end.x,
        road.end.y,
        55,
        "#b89b72"
      );

      renderer.drawLine(
        road.start.x,
        road.start.y,
        road.end.x,
        road.end.y,
        5,
        "#8d7658"
      );
    }
  }

  private renderBuildings(renderer: Renderer) {
    for (const building of homeWorldData.buildings) {
      const { bounds } = building;

      renderer.drawRect(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        "#c9b39a"
      );

      renderer.drawRect(
        bounds.x + 10,
        bounds.y + 10,
        bounds.width - 20,
        bounds.height - 20,
        "#e5d4bd"
      );

      renderer.drawText(
        building.name,
        bounds.x,
        bounds.y - 10,
        "#ffffff"
      );
    }
  }

  private renderPlantation(renderer: Renderer) {
    const plantation = homeWorldData.plantations[0];

    renderer.drawRect(
      plantation.bounds.x,
      plantation.bounds.y,
      plantation.bounds.width,
      plantation.bounds.height,
      "#557f45"
    );

    renderer.drawText(
      plantation.name,
      plantation.bounds.x,
      plantation.bounds.y - 15,
      "#ffffff"
    );
  }

  private renderTrees(renderer: Renderer) {
    const trees = [
      { x: -700, y: -450 },
      { x: -580, y: -500 },
      { x: -450, y: -480 },

      { x: 650, y: -500 },
      { x: 750, y: -430 },

      { x: -700, y: 400 },
      { x: -600, y: 480 },

      { x: 500, y: 500 },
      { x: 650, y: 480 },
      { x: 780, y: 520 },
    ];

    for (const tree of trees) {
      renderer.drawCircle(
        tree.x,
        tree.y,
        25,
        "#315d32"
      );

      renderer.drawRect(
        tree.x - 5,
        tree.y + 20,
        10,
        30,
        "#705238"
      );
    }
  }
}