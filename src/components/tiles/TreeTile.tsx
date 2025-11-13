interface TreeTileProps {
  x: number;
  y: number;
}

function TreeTile({ x, y }: TreeTileProps) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href="/asset/tile/1x1tree.png"
        x={x - 32}
        y={y - 64}
        width="64"
        height="96"
        style={{ imageRendering: 'pixelated' }}
      />
    </g>
  );
}

export default TreeTile;
