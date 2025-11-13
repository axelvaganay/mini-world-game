function WaterIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src="/asset/tile/1x1water.png"
        alt="Water"
        className="w-full h-full object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

export default WaterIcon;
