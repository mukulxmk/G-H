import type { WorldElement } from "./elements/WorldElement";
import type { WorldStreamingConfig } from "./WorldStreamingConfig";

export interface WorldDefinition {
  id: string;
  name: string;
  streaming: WorldStreamingConfig;
  elements: WorldElement[];
}