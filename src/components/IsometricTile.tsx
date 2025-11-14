import { useCallback } from 'react';
import { TileType } from '../App';
import GrassTile from './tiles/GrassTile';
import TreeTile from './tiles/TreeTile';
import WaterTile from './tiles/WaterTile';
import HutTile from './tiles/HutTile';
import StumpTile from './tiles/StumpTile';
import VillagersTile from './tiles/VillagersTile';
import { isHutOrigin } from '../utils/tileUtils';

interface VillagerAction {
  tileId: string;
  action: 'cutting' | null;
  targetTree: string | null;
  startTime: number;
  animationPhase: number;
}

interface IsometricTileProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isHovered: boolean;
  isHutPreview: boolean;
  tileType: TileType;
  tileId: string;
  placedTiles: Record<string, TileType>;
  villagerAction: VillagerAction | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  animationOffset?: { x: number; y: number };
  setPlacedTiles: React.Dispatch<React.SetStateAction<Record<string, TileType>>>;
}

function IsometricTile({
  x,
  y,
  width,
  height,
  isHovered,
  isHutPreview,
  tileType,
  tileId,
  placedTiles,
  villagerAction,
  onMouseEnter,
  onMouseLeave,
  onClick,
  animationOffset = { x: 0, y: 0 },
  setPlacedTiles,
}: IsometricTileProps) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const handleConvert = useCallback(() => {
    setPlacedTiles(prev => ({ ...prev, [tileId]: 'tree' }));
  }, [tileId, setPlacedTiles]);

  const points = `
    ${x},${y}
    ${x + halfWidth},${y + halfHeight}
    ${x},${y + height}
    ${x - halfWidth},${y + halfHeight}
  `;

  const getFillColor = () => {
    if (isHutPreview) return '#fbbf24';
    if (isHovered) return '#fbbf24';
    if (tileType === 'grass') return '#22c55e';
    if (tileType === 'tree') return '#22c55e';
    if (tileType === 'water') return '#60a5fa';
    if (tileType === 'hut') return '#22c55e';
    if (tileType === 'villagers') return '#22c55e';
    if (tileType === 'stump') return '#92400e';
    return '#6b7280';
  };

  const getStrokeColor = () => {
    if (isHutPreview) return '#f59e0b';
    if (isHovered) return '#f59e0b';
    if (tileType === 'grass') return '#16a34a';
    if (tileType === 'tree') return '#16a34a';
    if (tileType === 'water') return '#3b82f6';
    if (tileType === 'hut') return '#16a34a';
    if (tileType === 'villagers') return '#16a34a';
    if (tileType === 'stump') return '#16a34a';
    return '#4b5563';
  };

  const renderTileContent = () => {
    switch (tileType) {
      case 'grass':
        return <GrassTile x={x} y={y} />;
      case 'tree':
        return <TreeTile x={x} y={y} />;
      case 'water':
        return <WaterTile x={x} y={y} />;
      case 'hut':
        if (isHutOrigin(tileId, placedTiles)) {
          return <HutTile x={x} y={y} />;
        }
        return null;
      case 'stump':
        return <StumpTile x={x} y={y} onConvert={handleConvert} />;
      case 'villagers':
        return <VillagersTile x={x} y={y} villagerAction={villagerAction} animationOffset={animationOffset} />;
      default:
        return null;
    }
  };

  const fillColor = getFillColor();
  const strokeColor = getStrokeColor();

  return (
    <g>
      <polygon
        points={points}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        className="transition-colors duration-150 cursor-pointer"
        style={{ pointerEvents: 'all' }}
      />
      {renderTileContent()}
    </g>
  );
}

export default IsometricTile;
