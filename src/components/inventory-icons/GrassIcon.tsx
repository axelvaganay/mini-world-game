function GrassIcon() {
  return (
    <div className="w-full h-full bg-green-500 relative">
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0.5 p-1">
        <div className="bg-green-700 col-start-1 row-start-1"></div>
        <div className="bg-green-700 col-start-3 row-start-1"></div>
        <div className="bg-green-700 col-start-2 row-start-2"></div>
        <div className="bg-green-700 col-start-4 row-start-2"></div>
        <div className="bg-green-700 col-start-1 row-start-3"></div>
        <div className="bg-green-700 col-start-3 row-start-3"></div>
        <div className="bg-green-700 col-start-2 row-start-4"></div>
        <div className="bg-green-700 col-start-4 row-start-4"></div>
      </div>
    </div>
  );
}

export default GrassIcon;
