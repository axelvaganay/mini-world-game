import { TileType } from '../App';

interface IsometricTileProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isHovered: boolean;
  tileType: TileType;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

function IsometricTile({
  x,
  y,
  width,
  height,
  isHovered,
  tileType,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: IsometricTileProps) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const points = `
    ${x},${y}
    ${x + halfWidth},${y + halfHeight}
    ${x},${y + height}
    ${x - halfWidth},${y + halfHeight}
  `;

  const getFillColor = () => {
    if (isHovered) return '#fbbf24';
    if (tileType === 'grass') return '#22c55e';
    if (tileType === 'tree') return '#22c55e';
    return '#6b7280';
  };

  const getStrokeColor = () => {
    if (isHovered) return '#f59e0b';
    if (tileType === 'grass') return '#16a34a';
    if (tileType === 'tree') return '#16a34a';
    return '#4b5563';
  };

  const fillColor = getFillColor();
  const strokeColor = getStrokeColor();

  return (
    <g>
      <polygon
        points={points}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        className="transition-colors duration-150 cursor-pointer"
        style={{ pointerEvents: 'all' }}
      />
      {tileType === 'grass' && (
        <g>
          <rect x={x - 8} y={y + 8} width="3" height="3" fill="#15803d" />
          <rect x={x - 3} y={y + 10} width="3" height="3" fill="#15803d" />
          <rect x={x + 2} y={y + 8} width="3" height="3" fill="#15803d" />
          <rect x={x - 6} y={y + 14} width="3" height="3" fill="#15803d" />
          <rect x={x + 4} y={y + 13} width="3" height="3" fill="#15803d" />
        </g>
      )}
      {tileType === 'tree' && (
        <g>
          <rect x={x - 8} y={y + 8} width="3" height="3" fill="#15803d" />
          <rect x={x - 3} y={y + 10} width="3" height="3" fill="#15803d" />
          <rect x={x + 2} y={y + 8} width="3" height="3" fill="#15803d" />
          <rect x={x - 6} y={y + 14} width="3" height="3" fill="#15803d" />
          <rect x={x + 4} y={y + 13} width="3" height="3" fill="#15803d" />

          <rect x={x - 4} y={y - 12} width="8" height="24" fill="#92400e" />

          <ellipse cx={x} cy={y - 20} rx="16" ry="12" fill="#15803d" />
          <ellipse cx={x} cy={y - 28} rx="14" ry="10" fill="#166534" />
          <ellipse cx={x} cy={y - 35} rx="12" ry="8" fill="#14532d" />

          <circle cx={x - 6} cy={y - 22} r="3" fill="#14532d" />
          <circle cx={x + 7} cy={y - 25} r="3" fill="#14532d" />
          <circle cx={x - 4} cy={y - 30} r="2" fill="#14532d" />
          <circle cx={x + 5} cy={y - 32} r="2" fill="#14532d" />
        </g>
      )}
    </g>
  );
}

export default IsometricTile;
