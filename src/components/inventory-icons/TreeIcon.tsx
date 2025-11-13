function TreeIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src="/asset/tile/1x1tree.png"
        alt="Tree"
        className="w-full h-full object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

export default TreeIcon;
