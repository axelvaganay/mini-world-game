interface StumpTileProps {
  x: number;
  y: number;
}

function StumpTile({ x, y }: StumpTileProps) {
  const scale = 1.68; // 🎯 facteur d'agrandissement modifiable
  const offset = (64 * (scale - 1)) / 2;
  
  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href="/asset/tile/1x1stump.png"
        x={x - 32 - offset}
        y={y - 22 - offset}
        width={64 * scale}
        height={64 * scale}
        style={{ imageRendering: 'pixelated' }}
      />
    </g>
  );
}

export default StumpTile;