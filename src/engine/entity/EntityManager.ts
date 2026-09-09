import type { Entity } from "../../engine/entity/Entity";
import type { Renderer } from "@/src/engine/rendering/Renderer";

export class EntityManager {
  private readonly entities = new Set<Entity>();

  add(entity: Entity) {
    this.entities.add(entity);
    entity.initialize();
  }

  remove(entity: Entity) {
    if (!this.entities.has(entity)) return;

    entity.destroy();
    this.entities.delete(entity);
  }

  update(deltaTime: number) {
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }
  }

  render(renderer: Renderer) {
    for (const entity of this.entities) {
      entity.render(renderer);
    }
  }

  destroy() {
    for (const entity of this.entities) {
      entity.destroy();
    }

    this.entities.clear();
  }
}