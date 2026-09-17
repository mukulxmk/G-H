export interface ChunkCoordinates {
  x: number;
  y: number;
}

export function worldToChunkCoordinates(
  x: number,
  y: number,
  chunkSize: number
): ChunkCoordinates {
  if (chunkSize <= 0) {
    throw new Error(
      "Chunk size must be greater than zero."
    );
  }

  return {
    x: Math.floor(x / chunkSize),
    y: Math.floor(y / chunkSize),
  };
}

export function getNearbyChunkCoordinates(
  center: ChunkCoordinates,
  radius: number
): ChunkCoordinates[] {
  if (radius < 0 || !Number.isInteger(radius)) {
    throw new Error(
      "Chunk radius must be a non-negative integer."
    );
  }

  const coordinates: ChunkCoordinates[] = [];

  for (
    let y = center.y - radius;
    y <= center.y + radius;
    y++
  ) {
    for (
      let x = center.x - radius;
      x <= center.x + radius;
      x++
    ) {
      coordinates.push({ x, y });
    }
  }

  return coordinates;
}