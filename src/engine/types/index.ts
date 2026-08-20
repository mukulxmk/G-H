export interface EngineCallbacks {
  update: (deltaTime: number) => void;
  render: () => void;
}

export type EngineStatus =
  | "idle"
  | "running"
  | "paused"
  | "stopped";