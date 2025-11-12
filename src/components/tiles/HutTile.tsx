import GrassTile from './GrassTile';

interface HutTileProps {
  x: number;
  y: number;
}

function HutTile({ x, y }: HutTileProps) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <GrassTile x={x} y={y} />

      <image
        href="/asset/tile/4x4hut.png"
        x={x - 64}
        y={y - 96}
        width="128"
        height="128"
        style={{ imageRendering: 'pixelated', pointerEvents: 'none' }}
      />
    </g>
  );
}

export default HutTile;
