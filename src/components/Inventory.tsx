import { TileType } from '../App';
import { Eraser, Store, Package, Droplets } from 'lucide-react';

interface InventoryProps {
  selectedTile: TileType;
  onSelectTile: (tile: TileType) => void;
  onOpenShop: () => void;
  onOpenInventory: () => void;
  inventorySlots: (TileType)[];
  onInventorySlotChange: (slots: (TileType)[]) => void;
}

function Inventory({ selectedTile, onSelectTile, onOpenShop, onOpenInventory, inventorySlots, onInventorySlotChange }: InventoryProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const newSlots = [...inventorySlots];
      newSlots[slotIndex] = data.item;
      onInventorySlotChange(newSlots);
    } catch (error) {
      console.warn('Erreur lors du drop:', error);
    }
  };

  const handleSlotDragStart = (e: React.DragEvent, slotIndex: number) => {
    if (inventorySlots[slotIndex]) {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        item: inventorySlots[slotIndex],
        fromSlot: slotIndex
      }));
    }
  };

  const handleSlotDragEnd = (e: React.DragEvent, slotIndex: number) => {
    // Ne vider le slot que si l'objet a été déplacé vers un autre slot de la barre d'inventaire
    // Pas si l'objet vient de l'inventaire général
    const data = e.dataTransfer.getData('text/plain');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        // Si fromSlot est différent de -1, cela vient d'un autre slot de la barre d'inventaire
        if (parsedData.fromSlot !== -1 && e.dataTransfer.dropEffect === 'move') {
          const newSlots = [...inventorySlots];
          newSlots[slotIndex] = null;
          onInventorySlotChange(newSlots);
        }
      } catch (error) {
        console.warn('Erreur lors du drag end:', error);
      }
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 items-center z-50">
      <button
        onClick={onOpenShop}
        className="w-16 h-16 bg-slate-800 transition-all flex items-center justify-center border-4 border-slate-700 hover:border-slate-500 relative mr-2"
      >
        <Store className="w-8 h-8 text-yellow-400" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-slate-900"></div>
      </button>
      
      <button
        onClick={onOpenInventory}
        className="w-16 h-16 bg-slate-800 transition-all flex items-center justify-center border-4 border-slate-700 hover:border-slate-500 relative mr-2"
        title="Open inventory"
      >
        <Package className="w-8 h-8 text-blue-400" />
      </button>
      
      {inventorySlots.map((tile, index) => (
        <button
          key={index}
          onClick={() => tile && onSelectTile(tile)}
          draggable={tile !== null}
          onDragStart={(e) => handleSlotDragStart(e, index)}
          onDragEnd={(e) => handleSlotDragEnd(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className={`w-16 h-16 bg-slate-800 transition-all ${
            selectedTile === tile && tile !== null
              ? 'border-4 border-slate-300'
              : 'border-4 border-slate-700'
          } hover:border-slate-500 ${tile !== null ? 'cursor-grab' : 'cursor-pointer'}`}
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
          {tile === 'water' && (
            <div className="w-full h-full bg-blue-400 flex items-center justify-center">
              <Droplets className="w-10 h-10 text-blue-600" />
            </div>
          )}
          {tile === 'hut' && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 relative">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-7 bg-amber-900 border-2 border-amber-950"></div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-red-800 border-2 border-red-950" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-0.5 w-3 h-4 bg-amber-950"></div>
              </div>
            </div>
          )}
          {tile === 'villagers' && (
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
