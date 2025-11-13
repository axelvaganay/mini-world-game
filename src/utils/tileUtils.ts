export const getHutTiles = (centerTileId: string): string[] => {
  const [row, col] = centerTileId.split('-').map(Number);
  return [
    `${row}-${col}`,
    `${row}-${col + 1}`,
    `${row + 1}-${col}`,
    `${row + 1}-${col + 1}`
  ];
};

export const areHutTilesEmpty = (
  tileIds: string[],
  placedTiles: Record<string, any>
): boolean => {
  return tileIds.every(tileId => {
    const [row, col] = tileId.split('-').map(Number);
    if (row < 0 || row >= 10 || col < 0 || col >= 10) return false;

    // Vérifier si la tuile est occupée
    if (placedTiles[tileId]) return false;

    // Vérifier si une hutte adjacente occupe cette tuile
    for (let dr = -1; dr <= 0; dr++) {
      for (let dc = -1; dc <= 0; dc++) {
        const adjacentTileId = `${row + dr}-${col + dc}`;
        if (placedTiles[adjacentTileId] === 'hut') {
          const [adjRow, adjCol] = adjacentTileId.split('-').map(Number);
          const hutTiles = getHutTiles(adjacentTileId);
          if (hutTiles.includes(tileId)) {
            return false;
          }
        }
      }
    }

    return true;
  });
};

export const getTileColor = (
  tileType: string | null,
  isHovered: boolean,
  isHutPreview: boolean
): { fill: string; stroke: string } => {
  if (isHutPreview) return { fill: '#fbbf24', stroke: '#f59e0b' };
  if (isHovered) return { fill: '#fbbf24', stroke: '#f59e0b' };

  const colorMap: Record<string, { fill: string; stroke: string }> = {
    grass: { fill: '#22c55e', stroke: '#16a34a' },
    tree: { fill: '#22c55e', stroke: '#16a34a' },
    water: { fill: '#60a5fa', stroke: '#3b82f6' },
    hut: { fill: '#22c55e', stroke: '#16a34a' },
    villagers: { fill: '#22c55e', stroke: '#16a34a' },
    stump: { fill: '#92400e', stroke: '#78350f' }
  };

  return colorMap[tileType || ''] || { fill: '#6b7280', stroke: '#4b5563' };
};

export const isHutOrigin = (tileId: string, placedTiles: Record<string, any>): boolean => {
  if (placedTiles[tileId] !== 'hut') return false;
  // Only render at the bottom-right tile of the 2x2 block
  const [row, col] = tileId.split('-').map(Number);
  const originTile = `${row - 1}-${col - 1}`;
  return placedTiles[originTile] === 'hut';
};
