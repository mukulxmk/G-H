import type { EngineStatus } from "../types";
import { Renderer } from "../rendering/Renderer";
import { GameLoop } from "./GameLoop";

export class Engine {
  private readonly renderer: Renderer;
  private readonly gameLoop: GameLoop;

  private status: EngineStatus = "idle";

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);

    this.gameLoop = new GameLoop({
      update: () => {
        // Game/simulation updates will go here later.
      },

      render: () => {
        this.renderer.render(
          this.gameLoop.getElapsedTime(),
          this.gameLoop.getDeltaTime()
        );
      },
    });
  }

  initialize() {
    this.resize();

    this.status = "idle";
  }

  start() {
    if (this.status === "running") return;

    this.status = "running";
    this.gameLoop.start();
  }

  pause() {
    if (this.status !== "running") return;

    this.gameLoop.pause();
    this.status = "paused";
  }

  resume() {
    if (this.status !== "paused") return;

    this.status = "running";
    this.gameLoop.start();
  }

  stop() {
    this.gameLoop.stop();
    this.status = "stopped";
  }

  resize() {
    const { width, height } =
      this.canvas.getBoundingClientRect();

    this.renderer.resize(width, height);
  }

  getStatus() {
    return this.status;
  }
}