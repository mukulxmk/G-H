export interface EngineCallbacks {
  update(deltaTime: number): void;
  render(): void;
  afterFrame?(): void;

  applicationUpdate?(deltaTime: number): void;
}

export type EngineStatus =
  | "idle"
  | "running"
  | "paused"
  | "stopped";