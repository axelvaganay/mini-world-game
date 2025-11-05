import GrassTile from './GrassTile';

interface TreeTileProps {
  x: number;
  y: number;
}

function TreeTile({ x, y }: TreeTileProps) {
  return (
    <g>
      <GrassTile x={x} y={y} />

      <rect x={x - 4} y={y - 12} width="8" height="24" fill="#92400e" />

      <ellipse cx={x} cy={y - 20} rx="16" ry="12" fill="#15803d" />
      <ellipse cx={x} cy={y - 28} rx="14" ry="10" fill="#166534" />
      <ellipse cx={x} cy={y - 35} rx="12" ry="8" fill="#14532d" />

      <circle cx={x - 6} cy={y - 22} r="3" fill="#14532d" />
      <circle cx={x + 7} cy={y - 25} r="3" fill="#14532d" />
      <circle cx={x - 4} cy={y - 30} r="2" fill="#14532d" />
      <circle cx={x + 5} cy={y - 32} r="2" fill="#14532d" />
    </g>
  );
}

export default TreeTile;
