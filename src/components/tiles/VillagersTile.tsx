import GrassTile from './GrassTile';

interface VillagerAction {
  tileId: string;
  action: 'cutting' | null;
  targetTree: string | null;
  startTime: number;
  animationPhase: number;
}

interface VillagersTileProps {
  x: number;
  y: number;
  villagerAction: VillagerAction | null;
  animationOffset?: { x: number; y: number };
}

function VillagersTile({ x, y, villagerAction, animationOffset = { x: 0, y: 0 } }: VillagersTileProps) {
  const isCutting = villagerAction?.action === 'cutting';

  return (
    <g style={{ transition: 'transform 1.5s ease-in-out', pointerEvents: 'none' }} transform={`translate(${animationOffset.x}, ${animationOffset.y})`}>
      <GrassTile x={x} y={y} />

      <circle cx={x} cy={y - 22} r="6" fill="#fde68a" stroke="#fbbf24" strokeWidth="1" />
      <rect x={x - 7} y={y - 16} width="14" height="12" rx="2" fill="#2563eb" stroke="#1e40af" strokeWidth="1" />
      <rect x={x - 7} y={y - 4} width="6" height="10" fill="#92400e" />
      <rect x={x + 1} y={y - 4} width="6" height="10" fill="#92400e" />

      {isCutting ? (
        <>
          {villagerAction.animationPhase === 0 && (
            <>
              <rect x={x - 12} y={y - 14} width="4" height="10" fill="#fde68a" transform={`rotate(-20 ${x - 10} ${y - 14})`} />
              <rect x={x + 8} y={y - 14} width="4" height="10" fill="#fde68a" transform={`rotate(20 ${x + 10} ${y - 14})`} />
              <rect x={x + 8} y={y - 20} width="12" height="3" fill="#94a3b8" transform={`rotate(30 ${x + 14} ${y - 18})`} />
            </>
          )}
          {villagerAction.animationPhase === 1 && (
            <>
              <rect x={x - 10} y={y - 12} width="4" height="10" fill="#fde68a" transform={`rotate(-10 ${x - 8} ${y - 12})`} />
              <rect x={x + 6} y={y - 18} width="4" height="10" fill="#fde68a" transform={`rotate(40 ${x + 8} ${y - 18})`} />
              <rect x={x + 6} y={y - 25} width="12" height="3" fill="#94a3b8" transform={`rotate(50 ${x + 12} ${y - 23})`} />
            </>
          )}
          {villagerAction.animationPhase === 2 && (
            <>
              <rect x={x - 10} y={y - 18} width="4" height="10" fill="#fde68a" transform={`rotate(-40 ${x - 8} ${y - 18})`} />
              <rect x={x + 6} y={y - 12} width="4" height="10" fill="#fde68a" transform={`rotate(10 ${x + 8} ${y - 12})`} />
              <rect x={x + 4} y={y - 20} width="12" height="3" fill="#94a3b8" transform={`rotate(20 ${x + 10} ${y - 18})`} />
            </>
          )}
        </>
      ) : (
        <>
          <rect x={x - 10} y={y - 14} width="4" height="8" fill="#fde68a" />
          <rect x={x + 6} y={y - 14} width="4" height="8" fill="#fde68a" />
        </>
      )}
    </g>
  );
}

export default VillagersTile;
