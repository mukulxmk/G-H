import type { Chunk } from "./Chunks";

export class ChunkRuntime {
  private readonly elementIds =
    new Set<string>();

  constructor(
    private readonly chunk: Chunk
  ) {}

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