function HutIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src="/asset/tile/4x4hut.png"
        alt="Hut"
        className="w-full h-full object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

export default HutIcon;
