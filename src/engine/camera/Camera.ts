export type CameraTarget = {
  x: number;
  y: number;
};

export class Camera {
  private x = 0;
  private y = 0;

  private zoom = 1;

  private viewportWidth = 0;
  private viewportHeight = 0;

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setZoom(zoom: number) {
    if (zoom <= 0) return;

    this.zoom = zoom;
  }

  getZoom() {
    return this.zoom;
  }

  resize(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  follow(target: {x: number, y: number }) {
    this.x = target.x;
    this.y = target.y;
  }

  worldToScreen(x: number, y: number) {
    return {
      x:
        (x - this.x) * this.zoom +
        this.viewportWidth / 2,

      y:
        (y - this.y) * this.zoom +
        this.viewportHeight / 2,
    };
  }

  screenToWorld(x: number, y: number) {
    return {
      x:
        (x - this.viewportWidth / 2) / this.zoom +
        this.x,

      y:
        (y - this.viewportHeight / 2) / this.zoom +
        this.y,
    };
  }
}