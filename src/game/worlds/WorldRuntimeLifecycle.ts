import type { ChunkCoordinates } from "./ChunkCoordinates";

export type WorldRuntimeLifecycleEvent =
  | {
      type: "element-activated";
      elementId: string;
      chunk: ChunkCoordinates;
    }
  | {
      type: "element-deactivated";
      elementId: string;
      chunk: ChunkCoordinates;
    };