import GrassTile from './GrassTile';

interface HutTileProps {
  x: number;
  y: number;
}

function HutTile({ x, y }: HutTileProps) {
  return (
    <g>
      <GrassTile x={x} y={y} />

      <rect
        x={x - 30}
        y={y - 8}
        width="60"
        height="40"
        fill="#78350f"
        stroke="#451a03"
        strokeWidth="2"
      />
      <polygon
        points={`${x},${y - 48} ${x + 40},${y - 8} ${x - 40},${y - 8}`}
        fill="#991b1b"
        stroke="#7f1d1d"
        strokeWidth="2"
      />
      <rect
        x={x + 2}
        y={y - 2}
        width="16"
        height="20"
        fill="#451a03"
      />
    </g>
  );
}

export default HutTile;
