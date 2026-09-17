import type { Geometry } from "./Geometry";

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getGeometryBounds(
  geometry: Geometry
): Bounds {
  switch (geometry.type) {
    case "rectangle":
      return {
        x: geometry.x,
        y: geometry.y,
        width: geometry.width,
        height: geometry.height,
      };

    case "circle":
      return {
        x: geometry.x - geometry.radius,
        y: geometry.y - geometry.radius,
        width: geometry.radius * 2,
        height: geometry.radius * 2,
      };

    case "polygon":
      return getPointsBounds(
        geometry.points
      );

    case "path":
      return getPathBounds(
        geometry.points,
        geometry.width
      );
  }
}

function getPointsBounds(
  points: { x: number; y: number }[]
): Bounds {
  if (points.length === 0) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    const point = points[i];

    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function getPathBounds(
  points: { x: number; y: number }[],
  width: number
): Bounds {
  const bounds = getPointsBounds(points);

  const padding = width / 2;

  return {
    x: bounds.x - padding,
    y: bounds.y - padding,
    width: bounds.width + width,
    height: bounds.height + width,
  };
}