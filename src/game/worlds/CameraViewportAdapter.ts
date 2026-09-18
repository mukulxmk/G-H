import type { Camera } from "@/engine/camera/Camera";
import type { Bounds } from "./geometry/GeometryBounds";

export function getCameraWorldViewport(
  camera: Camera
): Bounds {
  const zoom = camera.getZoom();

  if (zoom <= 0) {
    throw new Error(
      "Camera zoom must be greater than zero."
    );
  }

  const width =
    camera.getViewportWidth() / zoom;

  const height =
    camera.getViewportHeight() / zoom;

  return {
    x: camera.getX() - width / 2,
    y: camera.getY() - height / 2,
    width,
    height,
  };
}