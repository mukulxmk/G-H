export interface PlayerActionRecord {
  actionId: string;
  timestamp: number;
}

export interface MissionHistoryRecord {
  missionId: string;
  status: "completed" | "failed" | "abandoned";
  timestamp: number;
}

export interface RelationshipState {
  npcId: string;
  value: number;
}

export interface WorldChangeRecord {
  worldId: string;
  changeId: string;
  timestamp: number;
}