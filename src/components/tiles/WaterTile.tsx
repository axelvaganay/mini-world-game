interface WaterTileProps {
  x: number;
  y: number;
}

function WaterTile({ x, y }: WaterTileProps) {
  const scale = 1.70; // 🎯 facteur d'agrandissement modifiable
  const offset = (64 * (scale - 1)) / 2;
  
  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href="/asset/tile/1x1water.png"
        x={x - 32 - offset}
        y={y - offset / 2}
        width={64 * scale}
        height={32 * scale}
        style={{ imageRendering: 'pixelated' }}
      />
    </g>
  );
}

export default WaterTile;