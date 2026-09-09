import type { World } from "./World";
import type { Renderer } from "@/src/engine/rendering/Renderer";
import { EntityManager } from "@/src/engine/entity/EntityManager";
import { TestEntity } from "@/src/game/entities/TestEntity";
import { Input } from "@/src/engine/input/Input";
import { Camera } from "@/src/engine/camera/Camera";

export class TestWorld implements World {
  private readonly entityManager = new EntityManager();
  private testEntity: TestEntity | null = null;

  constructor(private readonly input: Input, private readonly camera: Camera) {}

  private elapsedTime = 0;
  private removedEntity = false;

  private entityToRemove: TestEntity | null = null;

  initialize() {
    console.log("First Test World Initialized")
    this.testEntity = new TestEntity(
      200,
      200,
      200,
      this.input,
      "#ff0000"
    );

    this.testEntity.testComponent?.initialize();
    this.entityManager.add(this.testEntity);
  }

  update(deltaTime: number) {
    this.entityManager.update(deltaTime);
    this.testEntity?.testComponent?.update(deltaTime);
    console.log(this.testEntity?.getPosition(), "first");
    
    this.camera.follow(this.testEntity?.getPosition());
  }

  render(renderer: Renderer) {
    this.entityManager.render(renderer);
  }

  destroy() {
    this.testEntity?.testComponent?.destroy()
    this.entityManager.destroy();
  }

}