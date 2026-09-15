export type WorldElementState = {
  elementId: string;

  active?: boolean;

  destroyed?: boolean;

  replacementId?: string;
};

export interface WorldState {
  worldId: string;

  elements: WorldElementState[];
}