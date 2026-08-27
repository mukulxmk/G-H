export class Renderer {
  private readonly context: CanvasRenderingContext2D;

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

  drawCircle(
    x: number,
    y: number,
    radius: number,
    color: string
  ) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fillStyle = color;
    this.context.fill();
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
}