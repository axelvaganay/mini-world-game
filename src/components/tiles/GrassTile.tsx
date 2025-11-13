interface GrassTileProps {
  x: number;
  y: number;
}

function GrassTile({ x, y }: GrassTileProps) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href="/asset/tile/1x1grass.png"
        x={x - 32}
        y={y}
        width="64"
        height="32"
        style={{ imageRendering: 'pixelated' }}
      />
    </g>
  );
}

export default GrassTile;
