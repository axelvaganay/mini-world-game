export interface VillagerAction {
  tileId: string;
  action: 'cutting' | null;
  targetTree: string | null;
  startTime: number;
  animationPhase: number;
}

export interface FloatingText {
  id: number;
  amount: number;
  isPositive: boolean;
  location: 'inventory' | 'wallet';
}
