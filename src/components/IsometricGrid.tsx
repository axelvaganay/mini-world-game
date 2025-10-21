import { useState } from 'react';
import IsometricTile from './IsometricTile';
import { TileType } from '../App';

const GRID_SIZE = 10;
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

interface IsometricGridProps {
  placedTiles: Record<string, TileType>;
  onTileClick: (tileId: string) => void;
}

function IsometricGrid({ placedTiles, onTileClick }: IsometricGridProps) {
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
        tileType: placedTiles[tileId] || null,
      });
    }
  }

  return (
    <div className="relative">
      <svg
        width={GRID_SIZE * TILE_WIDTH + 100}
        height={GRID_SIZE * TILE_HEIGHT + 100}
        className="overflow-visible"
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
              tileType={tile.tileType}
              onMouseEnter={() => setHoveredTile(tile.id)}
              onMouseLeave={() => setHoveredTile(null)}
              onClick={() => onTileClick(tile.id)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default IsometricGrid;
