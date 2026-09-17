import type { Geometry } from "../geometry/Geometry";

export type WorldElementType =
  | "ground"
  | "terrain"
  | "water"
  | "road"
  | "building"
  | "vegetation"
  | "bridge"
  | "mountain"
  | "decoration";

export type WorldElementVisual = {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
};

export interface WorldElement {
  id: string;

  type: WorldElementType;

  geometry: Geometry;

  zIndex: number;

  replacementOnly?: boolean;

  visual?: WorldElementVisual;
}