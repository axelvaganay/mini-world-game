interface WaterTileProps {
  x: number;
  y: number;
}

function WaterTile({ x, y }: WaterTileProps) {
  return (
    <g>
      <ellipse cx={x - 8} cy={y + 10} rx="6" ry="4" fill="#3b82f6" opacity="0.6" />
      <ellipse cx={x + 5} cy={y + 12} rx="5" ry="3" fill="#2563eb" opacity="0.5" />
      <ellipse cx={x - 2} cy={y + 16} rx="7" ry="4" fill="#1d4ed8" opacity="0.6" />
      <circle cx={x - 10} cy={y + 8} r="2" fill="#60a5fa" opacity="0.8" />
      <circle cx={x + 8} cy={y + 10} r="2" fill="#60a5fa" opacity="0.7" />
    </g>
  );
}

export default WaterTile;
