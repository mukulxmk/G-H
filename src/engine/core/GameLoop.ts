import type { EngineCallbacks } from "../types";
import { Time } from "./Time";

export class GameLoop {
  private animationFrameId: number | null = null;
  private running = false;

  private readonly time = new Time();

  constructor(private readonly callbacks: EngineCallbacks) {}

  start() {
    if (this.running) return;

    this.running = true;
    this.time.reset();

    this.tick();
  }

  pause() {
    if (!this.running) return;

    this.running = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  stop() {
    this.pause();
    this.time.reset();
  }

  isRunning() {
    return this.running;
  }

  getDeltaTime() {
    return this.time.getDeltaTime();
  }

  getElapsedTime() {
    return this.time.getElapsedTime();
  }

  private tick = (currentTime = performance.now()) => {
    if (!this.running) return;

    this.time.update(currentTime);

    this.callbacks.update(this.time.getDeltaTime());
    this.callbacks.render();

    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}