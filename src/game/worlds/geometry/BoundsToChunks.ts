import type { ChunkCoordinates } from "../ChunkCoordinates";
import type { Bounds } from "./GeometryBounds";

export function getChunksForBounds(
  bounds: Bounds,
  chunkSize: number
): ChunkCoordinates[] {
  if (chunkSize <= 0) {
    throw new Error(
      "Chunk size must be greater than zero."
    );
  }

  const minChunkX = Math.floor(
    bounds.x / chunkSize
  );

  const minChunkY = Math.floor(
    bounds.y / chunkSize
  );

  const maxChunkX = Math.floor(
    (bounds.x + bounds.width) / chunkSize
  );

  const maxChunkY = Math.floor(
    (bounds.y + bounds.height) / chunkSize
  );

  const coordinates: ChunkCoordinates[] = [];

  for (
    let y = minChunkY;
    y <= maxChunkY;
    y++
  ) {
    for (
      let x = minChunkX;
      x <= maxChunkX;
      x++
    ) {
      coordinates.push({ x, y });
    }
  }

  return coordinates;
}