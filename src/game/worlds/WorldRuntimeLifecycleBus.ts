import type {
  WorldRuntimeLifecycleEvent,
} from "./WorldRuntimeLifecycle";

export type WorldRuntimeLifecycleListener = (
  event: WorldRuntimeLifecycleEvent
) => void;

export class WorldRuntimeLifecycleBus {
  private readonly listeners =
    new Set<WorldRuntimeLifecycleListener>();

  on(listener: WorldRuntimeLifecycleListener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(event: WorldRuntimeLifecycleEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  clear() {
    this.listeners.clear();
  }
}