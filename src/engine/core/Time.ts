export class Time {
  private lastTime = 0;
  private elapsedTime = 0;
  private deltaTime = 0;

  update(currentTime: number) {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      this.deltaTime = 0;
      return;
    }

    this.deltaTime = currentTime - this.lastTime;
    this.elapsedTime += this.deltaTime;
    this.lastTime = currentTime;
  }

  resetFrameTime() {
    this.lastTime = 0;
    this.deltaTime = 0;
  }

  reset() {
    this.lastTime = 0;
    this.elapsedTime = 0;
    this.deltaTime = 0;
  }

  getDeltaTime() {
    return this.deltaTime;
  }

  getElapsedTime() {
    return this.elapsedTime;
  }
}