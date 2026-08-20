export class Renderer {
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not get 2D canvas context");
    }

    this.context = context;
  }

  resize(width: number, height: number) {
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  render(elapsedTime: number, deltaTime: number) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    // Clear
    this.context.clearRect(0, 0, width, height);

    // Background
    this.context.fillStyle = "#111827";
    this.context.fillRect(0, 0, width, height);

    // Animated test object
    const x = width / 2 + Math.sin(elapsedTime / 500) * 100;
    const y = height / 2;

    this.context.beginPath();
    this.context.arc(x, y, 15, 0, Math.PI * 2);
    this.context.fillStyle = "#22c55e";
    this.context.fill();

    // Debug text
    this.context.fillStyle = "#ffffff";
    this.context.font = "16px Arial";

    this.context.fillText("ENGINE: RUNNING", 20, 35);

    const fps =
      deltaTime > 0 ? Math.round(1000 / deltaTime) : 0;

    this.context.fillText(`FPS: ${fps}`, 20, 60);
    this.context.fillText(
      `Delta: ${deltaTime.toFixed(2)}ms`,
      20,
      85
    );
  }
}