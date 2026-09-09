export type EventHandler<T = unknown> = (data: T) => void;

export class EventBus {
  private readonly listeners = new Map<
    string,
    Set<EventHandler>
  >();

  on<T>(event: string, handler: EventHandler<T>) {
    let handlers = this.listeners.get(event);

    if (!handlers) {
      handlers = new Set();
      this.listeners.set(event, handlers);
    }

    handlers.add(handler as EventHandler);

    return () => {
      this.off(event, handler);
    };
  }

  off<T>(event: string, handler: EventHandler<T>) {
    const handlers = this.listeners.get(event);

    if (!handlers) return;

    handlers.delete(handler as EventHandler);

    if (handlers.size === 0) {
      this.listeners.delete(event);
    }
  }

  emit<T>(event: string, data: T) {
    const handlers = this.listeners.get(event);

    if (!handlers) return;

    for (const handler of handlers) {
      handler(data);
    }
  }

  clear() {
    this.listeners.clear();
  }
}