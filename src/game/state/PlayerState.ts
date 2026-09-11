import { PlayerActionRecord, MissionHistoryRecord, RelationshipState } from "./types";

export interface PlayerState {
  money: number;

  currentWorldId: string;

  actions: PlayerActionRecord[];

  missionHistory: MissionHistoryRecord[];

  relationships: RelationshipState[];
}