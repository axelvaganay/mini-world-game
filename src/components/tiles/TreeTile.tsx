interface TreeTileProps {
  x: number;
  y: number;
}

function TreeTile({ x, y }: TreeTileProps) {
  const scale = 1.3; // 🎯 facteur d'agrandissement modifiable
  const offset = (64 * (scale - 1)) / 2;
  
  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href="/asset/tile/1x1tree.png"
        x={x - 32 - offset} // x - petit nombre = droite)
        y={y - 67 - offset * 1.5} // y - petit nombre  = descend
        width={64 * scale}
        height={96 * scale}
        style={{ imageRendering: 'pixelated' }}
      />
    </g>
  );
}

export default TreeTile;