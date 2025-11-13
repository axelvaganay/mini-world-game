interface GrassTileProps {
  x: number;
  y: number;
}

function GrassTile({ x, y }: GrassTileProps) {
  const scale = 2; // 🎯 facteur d'agrandissement modifiable
  const offset = (64 * (scale - 1)) / 2;
  
  return (
    <g style={{ pointerEvents: 'none' }}>
      <image
        href="/asset/tile/1x1grass.png"
        x={x - 32 - offset} // gauche droite (x - petit chiffre = droite)
        y={y - offset / 2} // monter descendre (y - 10 - offset / 2 par exemple)
        width={64 * scale}
        height={32 * scale}
        style={{ imageRendering: 'pixelated' }}
      />
    </g>
  );
}

export default GrassTile;