export type TimeFormat =
  | "hh:mm:ss.SSS"
  | "mm:ss.SSS"
  | "hh:mm:ss"
  | "mm:ss";

class DebugStatsStore {
  private elapsedTime = 0;
  private deltaTime = 0;

  update(elapsedTime: number, deltaTime: number) {
    this.elapsedTime = elapsedTime;
    this.deltaTime = deltaTime;
  }

  fps() {
    return this.deltaTime > 0
      ? Math.round(1000 / this.deltaTime)
      : 0;
  }

  delta() {
    return `${this.deltaTime.toFixed(2)} ms`;
  }

  elapsed(format?: TimeFormat) {
    if (!format) {
      return this.elapsedTime;
    }

    const time = new Date(this.elapsedTime).toISOString();

    switch (format) {
      case "hh:mm:ss.SSS":
        return time.slice(11, 23);

      case "mm:ss.SSS":
        return time.slice(14, 23);

      case "hh:mm:ss":
        return time.slice(11, 19);

      case "mm:ss":
        return time.slice(14, 19);
    }
  }
}

export const DebugStats = new DebugStatsStore();