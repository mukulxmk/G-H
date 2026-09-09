import { PlayerEntity } from "../entities/PlayerEntity";
import { Renderer } from "@/src/engine/rendering/Renderer";
import { Input } from "@/src/engine/input/Input";
import { Camera } from "@/src/engine/camera/Camera";

export class TestWorld2 {

  private player: PlayerEntity;

  constructor(
    private readonly input: Input,
    private readonly camera: Camera
  ) {
    this.player = new PlayerEntity({
      input,
      x: 0,
      y: 0,
      moveSpeed: 200,
      radius: 24,
    });
  }

  initialize() {
    this.player.initialize();

    this.camera.follow(this.player.transform);
  }

  update(deltaTime: number) {
    this.player.update(deltaTime);
console.log(this.player.getPosition(), "second");

    this.camera.follow(this.player.transform);
  }

  render(renderer: Renderer) {
    this.player.render(renderer);
  }

  destroy() {
    this.player.destroy();
  }
}