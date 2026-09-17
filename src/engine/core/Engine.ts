import type { EngineStatus } from "../types";
import { Renderer } from "../rendering/Renderer";
import { GameLoop } from "./GameLoop";
import { Viewport } from "./Viewport";
import { Scene } from "../scenes/Scene";
import { Input } from "../input/Input";
import { Camera } from "../camera/Camera";
import { EventBus } from "../events/EventBus";

export class Engine {
  private readonly renderer: Renderer;
  private readonly gameLoop: GameLoop;
  private readonly viewport = new Viewport();
  private readonly input =  new Input();
  private readonly camera = new Camera();
  private readonly eventBus = new EventBus();
  private currentScene: Scene | null = null;
  private applicationUpdate: ((deltaTime: number) => void) | null = null

  private status: EngineStatus = "idle";
  private destroyed = false;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);

    this.gameLoop = new GameLoop({
      update: this.update,
      render: this.render,
    });
  }

  setScene(scene: Scene) {
    if (this.destroyed) return;

    this.currentScene?.destroy();

    this.currentScene = scene;
    this.currentScene.initialize();

    this.render();
  }

  initialize() {
    if (this.destroyed) {
      throw new Error("Cannot initialize a destroyed engine");
    }

    this.input.initialize();
    this.renderer.setCamera(this.camera);

    this.status = "idle";
  }

  start() {
    if (this.destroyed) return;
    if (this.status === "running") return;

    this.status = "running";
    this.gameLoop.start();
  }

  pause() {
    if (this.destroyed) return;
    if (this.status !== "running") return;

    this.gameLoop.pause();
    this.status = "paused";
  }

  resume() {
    if (this.destroyed) return;
    if (this.status !== "paused") return;

    this.status = "running";
    this.gameLoop.resume();
  }

  stop() {
    if (this.destroyed) return;

    this.gameLoop.stop();
    this.status = "stopped";
  }

  resize(width: number, height: number) {
    if (this.destroyed) return;

    this.viewport.resize(width, height);

    this.renderer.resize(
      this.viewport.getWidth(),
      this.viewport.getHeight(),
      this.viewport.getDevicePixelRatio()
    );

    this.camera.resize(width, height)

    // Changing canvas dimensions clears its drawing buffer.
    // Redraw immediately, even if the game loop is paused/stopped.
    this.render();
  }

  update = (deltaTime: number) => {
    if (this.destroyed) return;

    if(this.applicationUpdate) this.applicationUpdate?.(deltaTime);

    this.currentScene?.update(deltaTime);
  };

  render = () => {
    if (this.destroyed) return;

    this.renderer.clear("#888888");

    this.currentScene?.render(this.renderer);
  };

  destroy() {
    if (this.destroyed) return;

    this.currentScene?.destroy();
    this.currentScene = null;
    this.input.destroy();
    this.eventBus.clear();

    this.stop();

    this.destroyed = true;
  }

  getStatus() {
    return this.status;
  }

  getInput() {
    return this.input;
  }

  getCamera() { 
    return this.camera;
  }

  getEventBus() {
   return this.eventBus;
  }

  setApplicationUpdate(callback: (deltaTime: number) => void) {
    if(this.destroyed) return;

    console.log("APPLICATION UPDATE BRIDGE")

    this.applicationUpdate = callback
  }
}