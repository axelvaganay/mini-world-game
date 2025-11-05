function VillagersIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-9 h-12 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-200 rounded-full border-2 border-amber-300"></div>
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-6 h-5 bg-blue-600 border-2 border-blue-700"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-amber-800">
          <div className="absolute top-0 left-0 w-2.5 h-full bg-amber-800"></div>
          <div className="absolute top-0 right-0 w-2.5 h-full bg-amber-800"></div>
        </div>
        <div className="absolute top-4 left-0 w-2 h-4 bg-amber-200 rounded-sm"></div>
        <div className="absolute top-4 right-0 w-2 h-4 bg-amber-200 rounded-sm"></div>
      </div>
    </div>
  );
}

export default VillagersIcon;
