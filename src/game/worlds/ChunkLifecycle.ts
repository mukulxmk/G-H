import type { ChunkCoordinates } from "./ChunkCoordinates";

export type ChunkLifecycleState =
  | "unloaded"
  | "loading"
  | "loaded"
  | "unloading";

export type ChunkLifecycleEvent =
  | {
      type: "chunk-loading";
      coordinates: ChunkCoordinates;
    }
  | {
      type: "chunk-loaded";
      coordinates: ChunkCoordinates;
    }
  | {
      type: "chunk-unloading";
      coordinates: ChunkCoordinates;
    }
  | {
      type: "chunk-unloaded";
      coordinates: ChunkCoordinates;
    };