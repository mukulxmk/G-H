import type { WorldState } from "./WorldState";

export const testWorldState: WorldState = {
  worldId: "test-world",

  elements: {
    "ground": {
      status: "active",
    },

    "river": {
      status: "active",
    },

    "main-road": {
      status: "active",
    },

    "house-01": {
      status: "active",
    },

    "tree-01": {
      status: "destroyed",
    },
  },
};