interface StumpTileProps {
  x: number;
  y: number;
}

function StumpTile({ x, y }: StumpTileProps) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href="/asset/tile/1x1stump.png"
        x={x - 32}
        y={y - 32}
        width="64"
        height="64"
        style={{ imageRendering: 'pixelated' }}
      />
    </g>
  );
}

export default StumpTile;
