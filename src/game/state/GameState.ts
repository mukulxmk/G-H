import type { PlayerState } from "./PlayerState";
import { WorldChangeRecord } from "./types";


export interface GameState {
  player: PlayerState;

  worldChanges: WorldChangeRecord[];
}