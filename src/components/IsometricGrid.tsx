import { useState } from 'react';
import IsometricTile from './IsometricTile';
import { TileType } from '../App';

const GRID_SIZE = 10;
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

interface VillagerAction {
  tileId: string;
  action: 'cutting' | null;
  targetTree: string | null;
  startTime: number;
  animationPhase: number;
}

interface IsometricGridProps {
  placedTiles: Record<string, TileType>;
  onTileClick: (tileId: string) => void;
  onTileHover: (tileId: string) => void;
  onTileLeave: () => void;
  zoom: number;
  pan: { x: number; y: number };
  hutPreviewTiles: string[];
  villagerActions: Record<string, VillagerAction>;
}

function IsometricGrid({ placedTiles, onTileClick, onTileHover, onTileLeave, zoom, pan, hutPreviewTiles, villagerActions }: IsometricGridProps) {
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  const tiles = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const x = (col - row) * (TILE_WIDTH / 2);
      const y = (col + row) * (TILE_HEIGHT / 2);
      const tileId = `${row}-${col}`;

      tiles.push({
        id: tileId,
        x,
        y,
        row,
        col,
        isHovered: hoveredTile === tileId,
        isHutPreview: hutPreviewTiles.includes(tileId),
        tileType: placedTiles[tileId] || null,
        villagerAction: villagerActions[tileId] || null,
      });
    }
  }

  return (
    <div className="relative">
      <svg
        width={GRID_SIZE * TILE_WIDTH + 100}
        height={GRID_SIZE * TILE_HEIGHT + 100}
        className="overflow-visible"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out'
        }}
      >
        <g transform={`translate(${GRID_SIZE * TILE_WIDTH / 2 + 50}, 50)`}>
          {tiles.map((tile) => (
            <IsometricTile
              key={tile.id}
              x={tile.x}
              y={tile.y}
              width={TILE_WIDTH}
              height={TILE_HEIGHT}
              isHovered={tile.isHovered}
              isHutPreview={tile.isHutPreview}
              tileType={tile.tileType}
              villagerAction={tile.villagerAction}
              onMouseEnter={() => {
                setHoveredTile(tile.id);
                onTileHover(tile.id);
              }}
              onMouseLeave={() => {
                setHoveredTile(null);
                onTileLeave();
              }}
              onClick={() => onTileClick(tile.id)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default IsometricGrid;
