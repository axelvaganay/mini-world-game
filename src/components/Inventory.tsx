import { TileType } from '../App';
import { Eraser } from 'lucide-react';

interface InventoryProps {
  selectedTile: TileType;
  onSelectTile: (tile: TileType) => void;
}

function Inventory({ selectedTile, onSelectTile }: InventoryProps) {
  const slots: (TileType)[] = ['grass', 'tree', null, null, null, null, null, null, null, null];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 items-center">
      {slots.map((tile, index) => (
        <button
          key={index}
          onClick={() => tile && onSelectTile(tile)}
          className={`w-16 h-16 bg-slate-800 transition-all ${
            selectedTile === tile && tile !== null
              ? 'border-4 border-slate-300'
              : 'border-4 border-slate-700'
          } hover:border-slate-500`}
        >
          {tile === 'grass' && (
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
          )}
          {tile === 'tree' && (
            <div className="w-full h-full bg-green-600 relative">
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-amber-800"></div>
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-700 rounded-sm"></div>
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-green-700 rounded-sm"></div>
              <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-700 rounded-sm"></div>
            </div>
          )}
        </button>
      ))}
      <button
        onClick={() => onSelectTile('eraser')}
        className={`w-16 h-16 bg-slate-800 transition-all flex items-center justify-center ${
          selectedTile === 'eraser'
            ? 'border-4 border-slate-300'
            : 'border-4 border-slate-700'
        } hover:border-slate-500`}
      >
        <Eraser className="w-8 h-8 text-slate-300" />
      </button>
    </div>
  );
}

export default Inventory;
