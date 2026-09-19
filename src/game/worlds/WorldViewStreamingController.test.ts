import { describe, expect, it, vi } from "vitest";

import { Camera } from "@/src/engine/camera/Camera";
import { ChunkManager } from "./ChunkManager";
import {
  WorldSpatialIndex,
} from "./WorldSpatialIndex";
import {
  WorldSpatialRuntime,
} from "./WorldSpatialRuntime";
import {
  WorldRuntime,
} from "./WorldRuntime";
import {
  WorldViewStreamingController,
} from "./WorldViewController";
import type { 
    WorldDefinition 
} from "./WorldDefiniton";
import { 
  WorldView
} from "./WorldView";

describe(
  "WorldViewStreamingController",
  () => {
    const definition: WorldDefinition = {
      id: "test-world",
      name: "Test World",
      elements: [
        {
          id: "house-01",
          type: "building",
          geometry: {
            type: "rectangle",
            x: 10,
            y: 10,
            width: 20,
            height: 20,
          },
          zIndex: 10,
        },
      ],
    };

    function createSystems() {
      const camera =
        new Camera();

      camera.resize(
        800,
        600
      );

      const chunkManager =
        new ChunkManager(100);

      const spatialIndex =
        new WorldSpatialIndex(100);

      spatialIndex.addWorldDefinition(
        definition
      );

      const worldRuntime =
        new WorldRuntime(
          definition,
          {
            worldId:
              definition.id,
            elements: [],
          }
        );

      const spatialRuntime =
        new WorldSpatialRuntime(
          chunkManager,
          spatialIndex,
          worldRuntime
        );

      const world = {
        renderVisible: vi.fn()
      }

      const controller =
        new WorldViewStreamingController(
          camera,
          world,
          spatialRuntime,
          1
        );

      return {
        camera,
        chunkManager,
        spatialIndex,
        worldRuntime,
        spatialRuntime,
        world,
        controller,
      };
    }

    it(
      "loads chunks around the camera",
      () => {
        const {
          camera,
          controller,
          chunkManager,
        } = createSystems();

        camera.setPosition(
          0,
          0
        );

        controller.update();

        expect(
          chunkManager
            .getLoadedChunks()
        ).toHaveLength(9);
      }
    );

    it(
      "uses the camera position to determine the center chunk",
      () => {
        const {
          camera,
          controller,
          chunkManager,
        } = createSystems();

        camera.setPosition(
          250,
          350
        );

        controller.update();

        const loaded =
          chunkManager
            .getLoadedChunks();

        expect(
          loaded.some(
            (chunk) =>
              chunk
                .getCoordinates()
                .x === 2 &&
              chunk
                .getCoordinates()
                .y === 3
          )
        ).toBe(true);
      }
    );

    it(
      "updates the loaded region when the camera moves",
      () => {
        const {
          camera,
          controller,
          chunkManager,
        } = createSystems();

        camera.setPosition(
          0,
          0
        );

        controller.update();

        expect(
          chunkManager
            .getLoadedChunks()
            .some(
              (chunk) =>
                chunk
                  .getCoordinates()
                  .x === 0 &&
                chunk
                  .getCoordinates()
                  .y === 0
            )
        ).toBe(true);

        camera.setPosition(
          500,
          500
        );

        controller.update();

        expect(
          chunkManager
            .getLoadedChunks()
            .some(
              (chunk) =>
                chunk
                  .getCoordinates()
                  .x === 5 &&
                chunk
                  .getCoordinates()
                  .y === 5
            )
        ).toBe(true);

        expect(
          chunkManager
            .getLoadedChunks()
        ).toHaveLength(9);
      }
    );

    it(
      "uses the configured streaming radius",
      () => {
        const {
          camera,
          spatialRuntime,
        } = createSystems();

        const controller =
          new WorldViewStreamingController(
            camera,
            WorldView(),
            spatialRuntime,
            0
          );

        controller.update();

        expect(
          spatialRuntime
            .getLoadedChunks()
        ).toHaveLength(1);
      }
    );

    it(
      "rejects a negative streaming radius",
      () => {
        const {
          camera,
          spatialRuntime,
          world,
        } = createSystems();

        expect(
          () =>
            new WorldViewStreamingController(
              camera,
              world,
              spatialRuntime,
              -1
            )
        ).toThrow(
          "Streaming radius must be a non-negative integer."
        );
      }
    );

    it(
      "rejects a fractional streaming radius",
      () => {
        const {
          camera,
          spatialRuntime,
          world,
        } = createSystems();

        expect(
          () =>
            new WorldViewStreamingController(
              camera,
              world,
              spatialRuntime,
              1.5
            )
        ).toThrow(
          "Streaming radius must be a non-negative integer."
        );
      }
    );
    it(
        "passes the camera viewport to TestWorld.renderVisible",
        () => {
            const {
            camera,
            spatialRuntime,
            world,
            controller,
            } = createSystems();

            camera.setPosition(
            100,
            200
            );

            camera.setZoom(2);

            const renderVisible =
            vi.spyOn(
                world,
                "renderVisible"
            );
            
            const renderer = {
            clear: vi.fn(),
            } as any;

            controller.render(
            renderer
            );

            expect(
            renderVisible
            ).toHaveBeenCalledTimes(1);

            expect(
            renderVisible
            ).toHaveBeenCalledWith(
            renderer,
            {
                x: -100,
                y: 50,
                width: 400,
                height: 300,
            }
            );
        }
    );

    it("does not update streaming while the camera remains in the same chunk", () => {
  const camera = new Camera();

  camera.resize(1000, 600);
  camera.setPosition(100, 100);

  const world = {
    renderVisible: vi.fn(),
  };

  const spatialRuntime = {
      updateAround: vi.fn(),
      getChunkSize: vi.fn(() => 500),
    } as any;

    const controller =
      new WorldViewStreamingController(
        camera,
        world,
        spatialRuntime,
        1
      );

    controller.update();
    controller.update();
    controller.update();

    expect(
      spatialRuntime.updateAround
    ).toHaveBeenCalledTimes(1);
  });
  }
);