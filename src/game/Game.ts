import { Engine } from "../engine/core/Engine";
import { TestWorld } from "./worlds/TestWorld";
import { GameScene } from "./scenes/GameScene";

export class Game {
  private initialized = false;

  constructor(
    private readonly engine: Engine
  ) {}

  initialize() {
    if (this.initialized) return;

    const world = new TestWorld();

    const scene = new GameScene(
      world,
      () =>
        world.createViewController(
          this.engine.getCamera(),
        )
    );

    this.engine.setScene(scene);

    this.initialized = true;
  }

  update(_deltaTime: number) {
    if (!this.initialized) return;
  }

  destroy() {
    if (!this.initialized) return;

    this.initialized = false;
  }
}