import type { Renderer } from "@/src/engine/rendering/Renderer";
import { Transform } from "@/src/engine/core/Transform";
import { Input } from "@/src/engine/input/Input";

export interface PlayerEntityOptions {
  input: Input;

  x?: number;
  y?: number;

  moveSpeed?: number;
  radius?: number;

  bodyColor?: string;
  outlineColor?: string;

}

export class PlayerEntity {
  readonly transform: Transform;

  private readonly input: Input;

  private moveSpeed: number;
  private radius: number;

  private bodyColor: string;
  private outlineColor: string;

  private velocityX = 0;
  private velocityY = 0;

  private initialized = false;
  private destroyed = false;

  // Visual state
  private facingAngle = 0;
  private walkTime = 0;

  constructor(options: PlayerEntityOptions) {
    this.input = options.input;

    this.transform = new Transform();

    this.transform.setPosition(
      options.x ?? 50,
      options.y ?? 50
    );

    this.moveSpeed = options.moveSpeed ?? 200;
    this.radius = options.radius ?? 20;

    this.bodyColor = options.bodyColor ?? "#36d66b";
    this.outlineColor = options.outlineColor ?? "#123d24";
  }

  initialize(): void {
    if (this.initialized || this.destroyed) return;

    this.initialized = true;
    console.log("Entity Initialized");
  }

  update(deltaTime: number): void {
    if (!this.initialized || this.destroyed) return;

    this.updateMovement(deltaTime);
    this.updateAnimation(deltaTime);
  }

  render(renderer: Renderer): void {
    if (!this.initialized || this.destroyed) return;

    this.renderPlayer(renderer);
  }

  destroy(): void {
    if (this.destroyed) return;

    this.destroyed = true;
    this.initialized = false;
    console.log("Entity Destroyed");
    
  }

  // --------------------------------------------------
  // Movement
  // --------------------------------------------------

  private updateMovement(deltaTime: number): void {
    let inputX = 0;
    let inputY = 0;

    if (
      this.input.isKeyDown("w") ||
      this.input.isKeyDown("arrowup")
    ) {
      inputY -= 1;
    }

    if (
      this.input.isKeyDown("s") ||
      this.input.isKeyDown("arrowdown")
    ) {
      inputY += 1;
    }

    if (
      this.input.isKeyDown("a") ||
      this.input.isKeyDown("arrowleft")
    ) {
      inputX -= 1;
    }

    if (
      this.input.isKeyDown("d") ||
      this.input.isKeyDown("arrowright")
    ) {
      inputX += 1;
    }

    // Normalize diagonal movement.
    const length = Math.sqrt(
      inputX * inputX +
      inputY * inputY
    );

    if (length > 0) {
      inputX /= length;
      inputY /= length;
    }

    this.velocityX = inputX * this.moveSpeed;
    this.velocityY = inputY * this.moveSpeed;

    this.transform.x += this.velocityX * deltaTime;
    this.transform.y += this.velocityY * deltaTime;

    // Remember direction.
    if (length > 0) {
      this.facingAngle = Math.atan2(
        inputY,
        inputX
      );
    }
  }

  // --------------------------------------------------
  // Animation
  // --------------------------------------------------

  private updateAnimation(deltaTime: number): void {
    const moving =
      Math.abs(this.velocityX) > 0 ||
      Math.abs(this.velocityY) > 0;

    if (!moving) {
      this.walkTime = 0;
      return;
    }

    this.walkTime += deltaTime * 10;
  }

  // --------------------------------------------------
  // Rendering
  // --------------------------------------------------

  private renderPlayer(renderer: Renderer): void {
    const { x, y } = this.transform;

    const moving =
      Math.abs(this.velocityX) > 0 ||
      Math.abs(this.velocityY) > 0;

    /*
     * Small bobbing animation while walking.
     */
    const bob =
      moving
        ? Math.sin(this.walkTime) * 2
        : 0;

    // Shadow
    renderer.setFillStyle("#00000055");

    renderer.drawEllipse(
      x,
      y + this.radius * 0.75,
      this.radius * 0.8,
      this.radius * 0.35
    );

    // Body
    renderer.setFillStyle(this.bodyColor);

    renderer.drawCircle(
      x,
      y + bob,
      this.radius
    );

    // Outline
    renderer.setStrokeStyle(this.outlineColor);
    renderer.setLineWidth(3);

    renderer.strokeCircle(
      x,
      y + bob,
      this.radius
    );

    /*
     * Direction indicator.
     *
     * This makes the player visually communicate
     * which direction it is facing.
     */
    const eyeDistance = this.radius * 0.45;

    const eyeX =
      x +
      Math.cos(this.facingAngle) *
        eyeDistance;

    const eyeY =
      y +
      Math.sin(this.facingAngle) *
        eyeDistance +
      bob;

    renderer.setFillStyle("#ffffff");

    renderer.drawCircle(
      eyeX,
      eyeY,
      this.radius * 0.25
    );

    const pupilX =
      eyeX +
      Math.cos(this.facingAngle) *
        this.radius *
        0.10;

    const pupilY =
      eyeY +
      Math.sin(this.facingAngle) *
        this.radius *
        0.10;

    renderer.setFillStyle("#111111");

    renderer.drawCircle(
      pupilX,
      pupilY,
      this.radius * 0.11
    );
  }

  // --------------------------------------------------
  // Public API
  // --------------------------------------------------

  getVelocity() {
    return {
      x: this.velocityX,
      y: this.velocityY,
    };
  }

  getSpeed(): number {
    return Math.sqrt(
      this.velocityX * this.velocityX +
      this.velocityY * this.velocityY
    );
  }

  isMoving(): boolean {
    return this.getSpeed() > 0;
  }

  getRadius(): number {
    return this.radius;
  }

  getFacingAngle(): number {
    return this.facingAngle;
  }

  getPosition() {
    return this.transform.getPosition();
  }
}