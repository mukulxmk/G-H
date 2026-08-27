import type { EngineCallbacks } from "../types";
import { Time } from "./Time";
import { DebugStats } from "@/src/utils/DebugStats";
export class GameLoop {
  private animationFrameId: number | null = null;
  private running = false;
  private paused = false;

  private readonly time = new Time();
  // private readonly debugStats = new DebugStats();

  constructor(private readonly callbacks: EngineCallbacks) {}

  start() {
    if (this.running) return;

    this.running = true;
    this.paused = false;

    this.time.reset();

    this.tick();
  }

  pause() {
    if (!this.running) return;

    this.running = false;
    this.paused = true;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume() {
    if (this.running || !this.paused) return;

    this.running = true;
    this.paused = false;

    this.time.resetFrameTime();

    this.tick();
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.running = false;
    this.paused = false;

    this.time.reset();
  }

  isRunning() {
    return this.running;
  }

  isPaused() {
    return this.paused;
  }

  getDeltaTime() {
    return this.time.getDeltaTime();
  }

  getElapsedTime() {
    return this.time.getElapsedTime();
  }

  // getDebugStats() {
  //   return this.debugStats();
  // }

  private tick = (currentTime = performance.now()) => {
    if (!this.running) return;

    this.time.update(currentTime);

    DebugStats.update(
      this.time.getElapsedTime(),
      this.time.getDeltaTime()
    );

    this.callbacks.update(this.time.getDeltaTime());
    this.callbacks.render();
    this

    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}