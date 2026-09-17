import type { WorldElement } from "./elements/WorldElement";

export interface WorldDefinition {
  readonly id: string;

  readonly name: string;

  readonly elements: WorldElement[];
}