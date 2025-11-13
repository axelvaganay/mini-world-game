interface HutTileProps {
  x: number;
  y: number;
}

function HutTile({ x, y }: HutTileProps) {
  // This component is rendered at the bottom-right tile of the 2x2 hut
  // Calculate the origin (top-left) tile position from the bottom-right position
  // In isometric grid: moving up-left by one tile means x -= 32, y -= 16
  const originX = x - 32;
  const originY = y - 16;

  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href="/asset/tile/4x4hut.png"
        x={originX - 64}
        y={originY - 60}
        width="128"
        height="128"
        style={{ imageRendering: 'pixelated', pointerEvents: 'none' }}
      />
    </g>
  );
}

export default HutTile;
