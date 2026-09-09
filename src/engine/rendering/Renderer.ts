import { Camera } from "../camera/Camera";
export class Renderer {
  private readonly context: CanvasRenderingContext2D;
  private camera : Camera | null = null ;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get 2D canvas context");
    }

    this.context = context;
  }

  resize(
    width: number,
    height: number,
    devicePixelRatio: number
  ) {
    this.canvas.width = Math.floor(width * devicePixelRatio);
    this.canvas.height = Math.floor(height * devicePixelRatio);

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.context.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0
    );
  }

  clear(color = "#000000") {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.context.fillStyle = color;
    this.context.fillRect(0, 0, width, height);
  }

  drawCircle(x: number, y: number, radius: number, color?: string) {
      const position = this.camera ? this.camera.worldToScreen(x, y) : { x, y };
      const scaledRadius = this.camera ? radius * this.camera.getZoom() : radius;

      // Save the current context state (including the previous fillStyle)
      this.context.save();

      // Apply the new color if provided
      if (color) {
          this.context.fillStyle = color;
      }

      this.context.beginPath();
      this.context.arc(
          position.x,
          position.y,
          scaledRadius,
          0,
          Math.PI * 2
      );
      this.context.fill();

      // Restore the context to its original state
      this.context.restore();
  }


  drawText(
    text: string,
    x: number,
    y: number,
    color = "#ffffff"
  ) {
    this.context.fillStyle = color;
    this.context.font = "16px Arial";
    this.context.fillText(text, x, y);
  }

  setCamera(camera: Camera) { 
    this.camera = camera;
  }

  setFillStyle(color: string) {
  this.context.fillStyle = color;
}

setStrokeStyle(color: string) {
  this.context.strokeStyle = color;
}

setLineWidth(width: number) {
  this.context.lineWidth = width;
}

strokeCircle(
  x: number,
  y: number,
  radius: number
) {
  const position = this.camera
    ? this.camera.worldToScreen(x, y)
    : { x, y };

  const scaledRadius = this.camera
    ? radius * this.camera.getZoom()
    : radius;

  this.context.beginPath();

  this.context.arc(
    position.x,
    position.y,
    scaledRadius,
    0,
    Math.PI * 2
  );

  this.context.stroke();
}

drawEllipse(
  x: number,
  y: number,
  radiusX: number,
  radiusY: number
) {
  const position = this.camera
    ? this.camera.worldToScreen(x, y)
    : { x, y };

  const zoom = this.camera
    ? this.camera.getZoom()
    : 1;

  this.context.beginPath();

  this.context.ellipse(
    position.x,
    position.y,
    radiusX * zoom,
    radiusY * zoom,
    0,
    0,
    Math.PI * 2
  );

  this.context.fill();
}
}