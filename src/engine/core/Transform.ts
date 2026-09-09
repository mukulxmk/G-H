export class Transform {
  x = 0;
  y = 0;

  rotation = 0;

  scaleX = 1;
  scaleY = 1;

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setRotation(rotation: number) {
    this.rotation = rotation;
  }

  setScale(scaleX: number, scaleY = scaleX) {
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}