interface GrassTileProps {
  x: number;
  y: number;
}

function GrassTile({ x, y }: GrassTileProps) {
  return (
    <g>
      <rect x={x - 8} y={y + 8} width="3" height="3" fill="#15803d" />
      <rect x={x - 3} y={y + 10} width="3" height="3" fill="#15803d" />
      <rect x={x + 2} y={y + 8} width="3" height="3" fill="#15803d" />
      <rect x={x - 6} y={y + 14} width="3" height="3" fill="#15803d" />
      <rect x={x + 4} y={y + 13} width="3" height="3" fill="#15803d" />
    </g>
  );
}

export default GrassTile;
