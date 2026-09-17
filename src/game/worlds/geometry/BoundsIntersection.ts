import type { Bounds } from "./GeometryBounds";

export function boundsIntersect(
  a: Bounds,
  b: Bounds
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}