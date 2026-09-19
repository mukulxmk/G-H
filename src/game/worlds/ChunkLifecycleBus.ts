import type {
  ChunkLifecycleEvent,
} from "./ChunkLifecycle";

export type ChunkLifecycleListener = (
  event: ChunkLifecycleEvent
) => void;

export class ChunkLifecycleBus {
  private readonly listeners =
    new Set<ChunkLifecycleListener>();

  on(listener: ChunkLifecycleListener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(event: ChunkLifecycleEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  clear() {
    this.listeners.clear();
  }
}