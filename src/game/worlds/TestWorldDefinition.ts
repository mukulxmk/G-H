import type { WorldDefinition } from "./WorldDefiniton";

export const testWorldDefinition: WorldDefinition = {
  id: "test-world",

  name: "Test World",

  elements: [
    {
      id: "mountain-01",
      type: "mountain",

      geometry: {
        type: "polygon",

        points: [
          { x: -700, y: -400 },
          { x: -500, y: -650 },
          { x: -250, y: -400 },
          { x: -400, y: -300 },
        ],
      },

      zIndex: 10,

      visual: {
        fillColor: "#6f7f69",
        strokeColor: "#465544",
        strokeWidth: 4,
      },
    },

    {
      id: "river-01",
      type: "water",

      geometry: {
        type: "path",

        points: [
          { x: -900, y: 450 },
          { x: -600, y: 300 },
          { x: -300, y: 200 },
          { x: 0, y: 250 },
          { x: 300, y: 100 },
          { x: 600, y: 150 },
          { x: 900, y: -50 },
        ],

        width: 100,
      },

      zIndex: 20,

      visual: {
        fillColor: "#4debd6",
        strokeColor: "#f26f9c",
        strokeWidth: 4,
      },
    },

    {
      id: "main-road",
      type: "road",

      geometry: {
        type: "path",

        points: [
          { x: -900, y: 0 },
          { x: -450, y: 50 },
          { x: 0, y: 0 },
          { x: 450, y: -50 },
          { x: 900, y: 0 },
        ],

        width: 60,
      },

      zIndex: 30,

      visual: {
        fillColor: "#b89b72",
        strokeColor: "#806747",
        strokeWidth: 4,
      },
    },

    {
      id: "house-01",
      type: "building",

      geometry: {
        type: "rectangle",

        x: -150,
        y: -180,
        width: 140,
        height: 100,
      },

      zIndex: 40,

      visual: {
        fillColor: "#c9b39a",
        strokeColor: "#705238",
        strokeWidth: 4,
      },
    },

     {
      id: "house-02",
      type: "building",

      geometry: {
        type: "rectangle",

        x: -400,
        y: -280,
        width: 220,
        height: 150,
      },

      zIndex: 40,

      visual: {
        fillColor: "#c9b39a",
        strokeColor: "#705238",
        strokeWidth: 4,
      },
    },

    {
      id: "player-marker",
      type: "decoration",

      geometry: {
        type: "circle",

        x: 0,
        y: 0,
        radius: 20,
      },

      zIndex: 100,

      visual: {
        fillColor: "#ffffff",
        strokeColor: "#000000",
        strokeWidth: 3,
      },
    },
    {
    id: "house-01-rebuilt",
    type: "building",

    geometry: {
        type: "rectangle",

        x: 150,
        y: 380,
        width: 160,
        height: 110,
    },

    zIndex: 40,

    visual: {
        fillColor: "#8fa6c1",
        strokeColor: "#34495e",
        strokeWidth: 4,
    },
    },
  ],
};