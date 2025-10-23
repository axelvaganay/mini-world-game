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
  animationOffset?: { x: number; y: number };
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
  animationOffset = { x: 0, y: 0 },
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
    if (tileType === 'water') return '#60a5fa';
    if (tileType === 'hut') return '#22c55e';
    if (tileType === 'villagers') return '#22c55e';
    return '#6b7280';
  };

  const getStrokeColor = () => {
    if (isHovered) return '#f59e0b';
    if (tileType === 'grass') return '#16a34a';
    if (tileType === 'tree') return '#16a34a';
    if (tileType === 'water') return '#3b82f6';
    if (tileType === 'hut') return '#16a34a';
    if (tileType === 'villagers') return '#16a34a';
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
      {tileType === 'water' && (
        <g>
          <ellipse cx={x - 8} cy={y + 10} rx="6" ry="4" fill="#3b82f6" opacity="0.6" />
          <ellipse cx={x + 5} cy={y + 12} rx="5" ry="3" fill="#2563eb" opacity="0.5" />
          <ellipse cx={x - 2} cy={y + 16} rx="7" ry="4" fill="#1d4ed8" opacity="0.6" />
          <circle cx={x - 10} cy={y + 8} r="2" fill="#60a5fa" opacity="0.8" />
          <circle cx={x + 8} cy={y + 10} r="2" fill="#60a5fa" opacity="0.7" />
        </g>
      )}
      {tileType === 'hut' && (
        <g>
          <rect x={x - 8} y={y + 8} width="3" height="3" fill="#15803d" />
          <rect x={x - 3} y={y + 10} width="3" height="3" fill="#15803d" />
          <rect x={x + 2} y={y + 8} width="3" height="3" fill="#15803d" />

          <rect x={x - 15} y={y - 8} width="30" height="20" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <polygon points={`${x},${y - 28} ${x + 20},${y - 8} ${x - 20},${y - 8}`} fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
          <rect x={x + 2} y={y - 2} width="8" height="10" fill="#451a03" />
        </g>
      )}
      {tileType === 'villagers' && (
        <g style={{ transition: 'transform 1.5s ease-in-out' }} transform={`translate(${animationOffset.x}, ${animationOffset.y})`}>
          <rect x={x - 8} y={y + 8} width="3" height="3" fill="#15803d" />
          <rect x={x - 3} y={y + 10} width="3" height="3" fill="#15803d" />
          <rect x={x + 2} y={y + 8} width="3" height="3" fill="#15803d" />

          <circle cx={x} cy={y - 22} r="6" fill="#fde68a" stroke="#fbbf24" strokeWidth="1" />
          <rect x={x - 7} y={y - 16} width="14" height="12" rx="2" fill="#2563eb" stroke="#1e40af" strokeWidth="1" />
          <rect x={x - 7} y={y - 4} width="6" height="10" fill="#92400e" />
          <rect x={x + 1} y={y - 4} width="6" height="10" fill="#92400e" />
          <rect x={x - 10} y={y - 14} width="4" height="8" fill="#fde68a" />
          <rect x={x + 6} y={y - 14} width="4" height="8" fill="#fde68a" />
        </g>
      )}
    </g>
  );
}

export default IsometricTile;
