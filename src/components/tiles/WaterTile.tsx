interface WaterTileProps {
  x: number;
  y: number;
}

function WaterTile({ x, y }: WaterTileProps) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href="/asset/tile/1x1water.png"
        x={x - 32}
        y={y}
        width="64"
        height="32"
        style={{ imageRendering: 'pixelated' }}
      />
    </g>
  );
}

export default WaterTile;
