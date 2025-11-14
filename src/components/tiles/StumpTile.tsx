import React, { useEffect, useState } from 'react';
import { STUMP_TO_TREE_SECONDS } from '../../constants/admin';

interface StumpTileProps {
  x: number;
  y: number;
  onConvert?: () => void; // stump -> tree
  delayMs?: number; // délai avant devenir un tree
}

// stump -> tree
function StumpTile({ x, y, onConvert, delayMs = STUMP_TO_TREE_SECONDS * 1000 }: StumpTileProps) {
  const [localIsTree, setLocalIsTree] = useState(false);

  // image
  const scale = 1.68; // 🎯 facteur d'agrandissement modifiable
  const offset = (64 * (scale - 1)) / 2;

  // stump -> tree
  useEffect(() => {
  const timeout = setTimeout(() => {
    setLocalIsTree(true); // Changer l'image localement
    if (onConvert) {
      onConvert(); // Mettre à jour l'état global
    }
  }, delayMs);

    return () => clearTimeout(timeout);
  }, [onConvert, delayMs]);

  const href = localIsTree ? '/asset/tile/1x1tree.png' : '/asset/tile/1x1stump.png';

  // image
  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href={href}
        x={x - 32 - offset}
        y={localIsTree ? y - 64 - offset * 1.5 : y - 22 - offset} // 🎯 Position différente tree vs stump
        width={64 * scale}
        height={localIsTree ? 96 * scale : 64 * scale} // 🎯 Hauteur différente tree vs stump
        style={{ imageRendering: 'pixelated' }}
      />
    </g>
  );
}


export default StumpTile;