import type { Chunk } from "./Chunks";

export class ChunkRuntime {
  private readonly elementIds =
    new Set<string>();

  private readonly activeElementIds =
    new Set<string>();

  constructor(
    private readonly chunk: Chunk
  ) {}

   activateElement(elementId: string) {
    if (!this.elementIds.has(elementId)) {
      return;
    }

    this.activeElementIds.add(elementId);
  }

  deactivateElement(elementId: string) {
    this.activeElementIds.delete(elementId);
  }

  isElementActive(elementId: string) {
    return this.activeElementIds.has(elementId);
  }

  getActiveElementIds() {
    return [...this.activeElementIds];
  }

  getChunk() {
    return this.chunk;
  }

  addElement(elementId: string) {
    this.elementIds.add(elementId);
  }

  removeElement(elementId: string) {
    this.elementIds.delete(elementId);
  }

  hasElement(elementId: string) {
    return this.elementIds.has(elementId);
  }

  getElementIds() {
    return [...this.elementIds];
  }

  clear() {
    this.elementIds.clear();
  }
}