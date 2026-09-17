export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BuildingData {
  id: string;
  name: string;
  bounds: Rect;
}

export interface PlantationData {
  id: string;
  name: string;
  bounds: Rect;
}

export const homeWorldData = {
  island: {
    x: -1000,
    y: -700,
    width: 2000,
    height: 1400,
  },

  roads: [
    {
      id: "main-road",
      start: { x: -850, y: 0 },
      end: { x: 850, y: 0 },
    },
    {
      id: "town-road",
      start: { x: 0, y: -600 },
      end: { x: 0, y: 600 },
    },
    {
      id: "north-road",
      start: { x: -600, y: -350 },
      end: { x: 600, y: -350 },
    },
  ],

  buildings: [
    {
      id: "house-01",
      name: "House",
      bounds: {
        x: -450,
        y: -280,
        width: 140,
        height: 100,
      },
    },
    {
      id: "house-02",
      name: "House",
      bounds: {
        x: 300,
        y: -280,
        width: 140,
        height: 100,
      },
    },
    {
      id: "shop-01",
      name: "Shop",
      bounds: {
        x: -180,
        y: 100,
        width: 160,
        height: 120,
      },
    },
    {
      id: "house-03",
      name: "House",
      bounds: {
        x: 180,
        y: 100,
        width: 140,
        height: 100,
      },
    },
  ],

  plantations: [
    {
      id: "plantation-01",
      name: "North Plantation",
      bounds: {
        x: 450,
        y: 200,
        width: 350,
        height: 250,
      },
    },
  ],
};