export type Point = {
  x: number;
  y: number;
};

export type RectangleGeometry = {
  type: "rectangle";

  x: number;
  y: number;

  width: number;
  height: number;
};

export type CircleGeometry = {
  type: "circle";

  x: number;
  y: number;

  radius: number;
};

export type PolygonGeometry = {
  type: "polygon";

  points: Point[];
};

export type PathGeometry = {
  type: "path";

  points: Point[];

  width: number;
};

export type Geometry =
  | RectangleGeometry
  | CircleGeometry
  | PolygonGeometry
  | PathGeometry;