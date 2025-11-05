function HutIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 relative">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-7 bg-amber-900 border-2 border-amber-950"></div>
        <div
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-red-800 border-2 border-red-950"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        ></div>
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-0.5 w-3 h-4 bg-amber-950"></div>
      </div>
    </div>
  );
}

export default HutIcon;
