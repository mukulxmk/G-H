import { describe, expect, it } from "vitest";
import { Camera } from "@/src/engine/camera/Camera";
import {
  getCameraWorldViewport,
} from "./CameraViewportAdapter";

describe("getCameraWorldViewport", () => {
  function createCamera() {
    const camera = new Camera();

    camera.resize(800, 600);

    return camera;
  }

  it("creates a viewport around the camera position", () => {
    const camera =
      createCamera();

    camera.setPosition(
      100,
      200
    );

    const viewport =
      getCameraWorldViewport(
        camera
      );

    expect(viewport).toEqual({
      x: -300,
      y: -100,
      width: 800,
      height: 600,
    });
  });

  it("accounts for camera zoom", () => {
    const camera =
      createCamera();

    camera.setPosition(
      100,
      200
    );

    camera.setZoom(2);

    const viewport =
      getCameraWorldViewport(
        camera
      );

    expect(viewport).toEqual({
      x: -100,
      y: 50,
      width: 400,
      height: 300,
    });
  });

  it("accounts for zooming out", () => {
    const camera =
      createCamera();

    camera.setPosition(
      100,
      200
    );

    camera.setZoom(0.5);

    const viewport =
      getCameraWorldViewport(
        camera
      );

    expect(viewport).toEqual({
      x: -700,
      y: -400,
      width: 1600,
      height: 1200,
    });
  });

  it("handles a camera at the world origin", () => {
    const camera =
      createCamera();

    const viewport =
      getCameraWorldViewport(
        camera
      );

    expect(viewport).toEqual({
      x: -400,
      y: -300,
      width: 800,
      height: 600,
    });
  });

  it("uses the current camera position", () => {
    const camera =
      createCamera();

    camera.setPosition(
      500,
      -300
    );

    const first =
      getCameraWorldViewport(
        camera
      );

    camera.setPosition(
      1000,
      700
    );

    const second =
      getCameraWorldViewport(
        camera
      );

    expect(first).not.toEqual(second);

    expect(second).toEqual({
      x: 600,
      y: 400,
      width: 800,
      height: 600,
    });
  });
});