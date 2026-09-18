import type { WorldDefinition } from "./WorldDefiniton";

export const testWorldDefinition: WorldDefinition = {
  id: "test-world",
  name: "Test World",

  elements: [
    // ─────────────────────────────
    // Ground
    // ─────────────────────────────

    {
      id: "island-ground",
      type: "ground",
      zIndex: 0,

      geometry: {
        type: "polygon",
        points: [
          { x: 0, y: 0 },
          { x: 3000, y: 0 },
          { x: 3000, y: 2000 },
          { x: 0, y: 2000 },
        ],
      },

      visual: {
        fillColor: "#6fa85c",
      },
    },

    // ─────────────────────────────
    // Water
    // ─────────────────────────────

    {
      id: "river",
      type: "water",
      zIndex: 1,

      geometry: {
        type: "path",
        points: [
          { x: 1400, y: 0 },
          { x: 1350, y: 400 },
          { x: 1450, y: 800 },
          { x: 1380, y: 1200 },
          { x: 1500, y: 1600 },
          { x: 1450, y: 2000 },
        ],
        width: 120,
      },

      visual: {
        fillColor: "#4d9bd6",
      },
    },

    // ─────────────────────────────
    // Roads
    // ─────────────────────────────

    {
      id: "main-road",
      type: "road",
      zIndex: 2,

      geometry: {
        type: "path",
        points: [
          { x: 200, y: 1000 },
          { x: 800, y: 1000 },
          { x: 1300, y: 1000 },
          { x: 1900, y: 1000 },
          { x: 2800, y: 1000 },
        ],
        width: 80,
      },

      visual: {
        fillColor: "#777777",
      },
    },

    {
      id: "cross-road",
      type: "road",
      zIndex: 2,

      geometry: {
        type: "path",
        points: [
          { x: 700, y: 200 },
          { x: 700, y: 700 },
          { x: 700, y: 1300 },
          { x: 700, y: 1800 },
        ],
        width: 60,
      },

      visual: {
        fillColor: "#858585",
      },
    },

    // ─────────────────────────────
    // Buildings
    // ─────────────────────────────

    {
      id: "house-01",
      type: "building",
      zIndex: 3,

      geometry: {
        type: "rectangle",
        x: 400,
        y: 500,
        width: 180,
        height: 140,
      },

      visual: {
        fillColor: "#c98f5a",
        strokeColor: "#4a3324",
        strokeWidth: 4,
      },
    },

    {
      id: "house-02",
      type: "building",
      zIndex: 3,

      geometry: {
        type: "rectangle",
        x: 900,
        y: 500,
        width: 220,
        height: 160,
      },

      visual: {
        fillColor: "#b87575",
        strokeColor: "#4a2929",
        strokeWidth: 4,
      },
    },

    // ─────────────────────────────
    // Vegetation
    // ─────────────────────────────

    {
      id: "tree-01",
      type: "vegetation",
      zIndex: 4,

      geometry: {
        type: "circle",
        x: 300,
        y: 300,
        radius: 45,
      },

      visual: {
        fillColor: "#2f7d32",
      },
    },

    {
      id: "tree-02",
      type: "vegetation",
      zIndex: 4,

      geometry: {
        type: "circle",
        x: 1250,
        y: 400,
        radius: 50,
      },

      visual: {
        fillColor: "#347a35",
      },
    },

    {
      id: "tree-03",
      type: "vegetation",
      zIndex: 4,

      geometry: {
        type: "circle",
        x: 2300,
        y: 500,
        radius: 55,
      },

      visual: {
        fillColor: "#286b2d",
      },
    },

    // ─────────────────────────────
    // Mountain
    // ─────────────────────────────

    {
      id: "mountain-01",
      type: "mountain",
      zIndex: 2,

      geometry: {
        type: "polygon",
        points: [
          { x: 2100, y: 1300 },
          { x: 2350, y: 900 },
          { x: 2600, y: 1300 },
        ],
      },

      visual: {
        fillColor: "#777777",
        strokeColor: "#4a4a4a",
        strokeWidth: 5,
      },
    },

    // ─────────────────────────────
    // Bridge
    // ─────────────────────────────

    {
      id: "bridge-01",
      type: "bridge",
      zIndex: 5,

      geometry: {
        type: "rectangle",
        x: 1320,
        y: 930,
        width: 160,
        height: 140,
      },

      visual: {
        fillColor: "#8b6a45",
        strokeColor: "#4d3926",
        strokeWidth: 4,
      },
    },

    // ─────────────────────────────
    // Decoration
    // ─────────────────────────────

    {
      id: "pond",
      type: "water",
      zIndex: 1,

      geometry: {
        type: "circle",
        x: 2200,
        y: 400,
        radius: 120,
      },

      visual: {
        fillColor: "#438fc4",
        strokeColor: "#28648c",
        strokeWidth: 5,
      },
    },
  ],
};