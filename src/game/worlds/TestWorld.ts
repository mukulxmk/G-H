import type { World } from "./World";
import type { Renderer } from "@/src/engine/rendering/Renderer";
import { EntityManager } from "@/src/game/entities/EntityManager";
import { TestEntity } from "@/src/game/entities/TestEntity";
import { DebugStats } from "@/src/utils/DebugStats";

export class TestWorld implements World {
  private readonly entities = new EntityManager();

  private elapsedTime = 0;
  private removedEntity = false;

  private entityToRemove: TestEntity | null = null;

  initialize() {
    console.log("TestWorld initialized");

    const entityA = new TestEntity(100, 150, 100);
    const entityB = new TestEntity(200, 250, 150);
    const entityC = new TestEntity(300, 350, 200);

    this.entityToRemove = entityB;

    this.entities.add(entityA);
    this.entities.add(entityB);
    this.entities.add(entityC);
  }

  update(deltaTime: number) {
    this.elapsedTime += deltaTime;

    this.entities.update(deltaTime);

    if (
      !this.removedEntity &&
      this.elapsedTime >= 5000 &&
      this.entityToRemove
    ) {
      this.entities.remove(this.entityToRemove);

      this.removedEntity = true;
    }
  }

  render(renderer: Renderer) {
    renderer.clear("#111827");

    renderer.drawText(`ELAPSED TIME: ${DebugStats.elapsed("hh:mm:ss")}`, 20, 35);
    renderer.drawText(`DELTA TIME: ${DebugStats.delta()}`, 20, 55);
    renderer.drawText(`FPS: ${DebugStats.fps()}`, 20, 75);

    renderer.drawText(
      this.removedEntity
        ? "ENTITY B REMOVED"
        : "3 ENTITIES RUNNING",
      20,
      115
    );

    this.entities.render(renderer);
  }

  destroy() {
    this.entities.destroy();

    console.log("TestWorld destroyed");
  }
}