import { describe, expect, it } from "vitest";

import { WorldRuntime } from "./WorldRuntime";
import type { WorldDefinition } from "./WorldDefiniton";
import type { WorldState } from "./WorldState";

const createTestDefinition = (): WorldDefinition => ({
  id: "test-world",

  name: "Test World",

  elements: [
    {
      id: "house-01",
      type: "building",

      geometry: {
        type: "rectangle",
        x: 0,
        y: 0,
        width: 100,
        height: 80,
      },

      zIndex: 10,

      visual: {
        fillColor: "#ffffff",
      },
    },

    {
      id: "house-01-rebuilt",
      type: "building",

      replacementOnly: true,

      geometry: {
        type: "rectangle",
        x: 0,
        y: 0,
        width: 120,
        height: 90,
      },

      zIndex: 10,

      visual: {
        fillColor: "#888888",
      },
    },

    {
      id: "house-01-final",
      type: "building",

      replacementOnly: true,

      geometry: {
        type: "rectangle",
        x: 0,
        y: 0,
        width: 140,
        height: 100,
      },

      zIndex: 10,

      visual: {
        fillColor: "#444444",
      },
    },

    {
      id: "road-01",
      type: "road",

      geometry: {
        type: "path",

        points: [
          { x: -500, y: 0 },
          { x: 500, y: 0 },
        ],

        width: 50,
      },

      zIndex: 20,

      visual: {
        fillColor: "#999999",
      },
    },
  ],
});

describe("WorldRuntime - replacement system", () => {
  describe("replacement resolution", () => {
    it("resolves an element to its replacement", () => {
      const definition = createTestDefinition();

      const state: WorldState = {
        worldId: definition.id,

        elements: [
          {
            elementId: "house-01",
            replacementId: "house-01-rebuilt",
          },
        ],
      };

      const runtime = new WorldRuntime(
        definition,
        state
      );

      const resolved =
        runtime.getResolvedElement("house-01");

      expect(resolved.id).toBe(
        "house-01-rebuilt"
      );
    });

    it("resolves a replacement chain to the final element", () => {
      const definition = createTestDefinition();

      const state: WorldState = {
        worldId: definition.id,

        elements: [
          {
            elementId: "house-01",
            replacementId: "house-01-rebuilt",
          },

          {
            elementId: "house-01-rebuilt",
            replacementId: "house-01-final",
          },
        ],
      };

      const runtime = new WorldRuntime(
        definition,
        state
      );

      const resolved =
        runtime.getResolvedElement("house-01");

      expect(resolved.id).toBe(
        "house-01-final"
      );
    });
  });

  describe("replacement-only elements", () => {
    it("does not render replacement-only elements independently", () => {
      const definition = createTestDefinition();

      const state: WorldState = {
        worldId: definition.id,

        elements: [],
      };

      const runtime = new WorldRuntime(
        definition,
        state
      );

      const activeElements =
        runtime.getActiveElements();

      expect(
        activeElements.map((element) => element.id)
      ).toEqual([
        "house-01",
        "road-01",
      ]);
    });

    it("renders a replacement-only element when it replaces another element", () => {
      const definition = createTestDefinition();

      const state: WorldState = {
        worldId: definition.id,

        elements: [
          {
            elementId: "house-01",
            replacementId: "house-01-rebuilt",
          },
        ],
      };

      const runtime = new WorldRuntime(
        definition,
        state
      );

      const activeElements =
        runtime.getActiveElements();

      expect(
        activeElements.map((element) => element.id)
      ).toEqual([
        "house-01-rebuilt",
        "road-01",
      ]);
    });
  });

  describe("circular references", () => {
    it("rejects direct circular replacement", () => {
      const definition = createTestDefinition();

      const state: WorldState = {
        worldId: definition.id,

        elements: [
          {
            elementId: "house-01",
            replacementId: "house-01-rebuilt",
          },

          {
            elementId: "house-01-rebuilt",
            replacementId: "house-01",
          },
        ],
      };

      expect(
        () =>
          new WorldRuntime(
            definition,
            state
          ).getResolvedElement("house-01")
      ).toThrow(
        "Circular world element replacement detected"
      );
    });

    it("rejects a longer circular replacement chain", () => {
      const definition: WorldDefinition = {
        ...createTestDefinition(),

        elements: [
          ...createTestDefinition().elements,

          {
            id: "element-a",
            type: "decoration",

            geometry: {
              type: "circle",
              x: 0,
              y: 0,
              radius: 10,
            },

            zIndex: 1,
          },

          {
            id: "element-b",
            type: "decoration",

            geometry: {
              type: "circle",
              x: 20,
              y: 0,
              radius: 10,
            },

            zIndex: 1,
          },

          {
            id: "element-c",
            type: "decoration",

            geometry: {
              type: "circle",
              x: 40,
              y: 0,
              radius: 10,
            },

            zIndex: 1,
          },
        ],
      };

      const state: WorldState = {
        worldId: definition.id,

        elements: [
          {
            elementId: "element-a",
            replacementId: "element-b",
          },

          {
            elementId: "element-b",
            replacementId: "element-c",
          },

          {
            elementId: "element-c",
            replacementId: "element-a",
          },
        ],
      };

      const runtime = new WorldRuntime(
        definition,
        state
      );

      expect(
        () =>
          runtime.getResolvedElement("element-a")
      ).toThrow(
        "Circular world element replacement detected"
      );
    });

    it("rejects an element replacing itself", () => {
      const definition = createTestDefinition();

      const runtime = new WorldRuntime(
        definition,
        {
          worldId: definition.id,
          elements: [],
        }
      );

      expect(() =>
        runtime.replaceElement(
          "house-01",
          "house-01"
        )
      ).toThrow(
        'World element "house-01" cannot replace itself.'
      );
    });
  });

  describe("unknown IDs", () => {
    it("rejects unknown element IDs in persisted state", () => {
      const definition = createTestDefinition();

      const state: WorldState = {
        worldId: definition.id,

        elements: [
          {
            elementId: "does-not-exist",
            destroyed: true,
          },
        ],
      };

      expect(
        () =>
          new WorldRuntime(
            definition,
            state
          )
      ).toThrow(
        'World state references unknown element "does-not-exist".'
      );
    });

    it("rejects an unknown replacement ID", () => {
      const definition = createTestDefinition();

      const runtime = new WorldRuntime(
        definition,
        {
          worldId: definition.id,
          elements: [],
        }
      );

      expect(() =>
        runtime.replaceElement(
          "house-01",
          "does-not-exist"
        )
      ).toThrow(
        'Cannot replace "house-01" with unknown element "does-not-exist".'
      );
    });

    it("rejects resolving an unknown element", () => {
      const definition = createTestDefinition();

      const runtime = new WorldRuntime(
        definition,
        {
          worldId: definition.id,
          elements: [],
        }
      );

      expect(() =>
        runtime.getResolvedElement(
          "does-not-exist"
        )
      ).toThrow(
        'World element "does-not-exist" does not exist.'
      );
    });
  });

  describe("state persistence", () => {
    it("returns the current runtime state", () => {
      const definition = createTestDefinition();

      const runtime = new WorldRuntime(
        definition,
        {
          worldId: definition.id,
          elements: [],
        }
      );

      runtime.replaceElement(
        "house-01",
        "house-01-rebuilt"
      );

      const state = runtime.getState();

      expect(state).toEqual({
        worldId: "test-world",

        elements: [
          {
            elementId: "house-01",
            active: true,
            destroyed: false,
            replacementId: "house-01-rebuilt",
          },
        ],
      });
    });

    it("can restore a runtime from persisted state", () => {
      const definition = createTestDefinition();

      const savedState: WorldState = {
        worldId: definition.id,

        elements: [
          {
            elementId: "house-01",
            active: true,
            destroyed: false,
            replacementId: "house-01-rebuilt",
          },
        ],
      };

      const runtime = new WorldRuntime(
        definition,
        savedState
      );

      const resolved =
        runtime.getResolvedElement(
          "house-01"
        );

      expect(resolved.id).toBe(
        "house-01-rebuilt"
      );

      expect(
        runtime.getState()
      ).toEqual(savedState);
    });

    it("persists destruction and restoration", () => {
      const definition = createTestDefinition();

      const runtime = new WorldRuntime(
        definition,
        {
          worldId: definition.id,
          elements: [],
        }
      );

      runtime.destroyElement("house-01");

      expect(
        runtime.getState()
      ).toEqual({
        worldId: "test-world",

        elements: [
          {
            elementId: "house-01",
            destroyed: true,
            active: false,
          },
        ],
      });

      runtime.restoreElement("house-01");

      expect(
        runtime.getState()
      ).toEqual({
        worldId: "test-world",

        elements: [
          {
            elementId: "house-01",
            destroyed: false,
            active: true,
          },
        ],
      });
    });

    it("preserves replacement state through serialization", () => {
      const definition = createTestDefinition();

      const runtime = new WorldRuntime(
        definition,
        {
          worldId: definition.id,
          elements: [],
        }
      );

      runtime.replaceElement(
        "house-01",
        "house-01-rebuilt"
      );

      const serialized = JSON.stringify(
        runtime.getState()
      );

      const restoredState: WorldState =
        JSON.parse(serialized);

      const restoredRuntime =
        new WorldRuntime(
          definition,
          restoredState
        );

      expect(
        restoredRuntime
          .getResolvedElement("house-01")
          .id
      ).toBe("house-01-rebuilt");
    });
  });
});