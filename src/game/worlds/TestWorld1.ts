import type { Renderer } from "@/src/engine/rendering/Renderer";
import type { World } from "./World";
import { Input } from "@/src/engine/input/Input";
import { Camera } from "@/src/engine/camera/Camera";

export class SecondTestWorld implements World {
  private elapsedTime = 0;

  initialize() {
    console.log("SecondTestWorld initialized");
  }

  update(deltaTime: number) {
    this.elapsedTime += deltaTime;
  }

  render(renderer: Renderer) {
    // Draw a visually different world:
    // large blue-ish circle pattern / orbital scene

    const centerX = 0;
    const centerY = 0;

    renderer.drawCircle(centerX, centerY, 80, "#ffff00");

    const radius = 180;
    const count = 8;

    for (let i = 0; i < count; i++) {
      const angle =
        (i / count) * Math.PI * 2 +
        this.elapsedTime * 0.001;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      renderer.drawCircle(x, y, 20);
    }
  }

  destroy() {
    console.log("SecondTestWorld destroyed");
  }
}