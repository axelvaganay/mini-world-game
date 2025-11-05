import GrassTile from './GrassTile';

interface StumpTileProps {
  x: number;
  y: number;
}

function StumpTile({ x, y }: StumpTileProps) {
  return (
    <g>
      <GrassTile x={x} y={y} />

      <rect
        x={x - 6}
        y={y + 2}
        width="12"
        height="8"
        fill="#92400e"
        stroke="#78350f"
        strokeWidth="1"
      />
      <ellipse cx={x} cy={y + 2} rx="6" ry="3" fill="#a16207" />
      <circle cx={x - 2} cy={y + 4} r="1.5" fill="#78350f" />
      <circle cx={x + 3} cy={y + 5} r="1" fill="#78350f" />
      <circle cx={x + 1} cy={y + 7} r="1.5" fill="#78350f" />
    </g>
  );
}

export default StumpTile;
