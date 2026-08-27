export class Viewport {
  private width = 0;
  private height = 0;
  private devicePixelRatio = 1;

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.devicePixelRatio = window.devicePixelRatio || 1;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getDevicePixelRatio() {
    return this.devicePixelRatio;
  }
}