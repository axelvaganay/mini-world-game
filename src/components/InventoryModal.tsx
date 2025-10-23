import { useState } from 'react';
import { X, Package, Hammer, User, Grid3X3, Droplets } from 'lucide-react';
import { TileType } from '../App';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDragStart: (item: TileType, fromSlot: number) => void;
  unlockedItems: Set<string>;
}

type TabType = 'all' | 'material' | 'building' | 'character';

interface InventoryItem {
  id: string;
  name: string;
  type: TabType;
  tileType: TileType;
  icon: string;
  description: string;
  quantity: number;
}

const inventoryItems: InventoryItem[] = [
  // Matériaux
  {
    id: 'grass',
    name: 'Grass',
    type: 'material',
    tileType: 'grass',
    icon: '🌱',
    description: 'Basic building material',
    quantity: 0
  },
  {
    id: 'tree',
    name: 'Tree',
    type: 'material',
    tileType: 'tree',
    icon: '🌳',
    description: 'Decorative tree',
    quantity: 0
  },
  {
    id: 'water',
    name: 'Water',
    type: 'material',
    tileType: 'water',
    icon: '💧',
    description: 'Water source',
    quantity: 0
  },
  {
    id: 'hut',
    name: 'Hut',
    type: 'building',
    tileType: 'hut',
    icon: '🏠',
    description: 'Small house',
    quantity: 0
  },
  {
    id: 'villagers',
    name: 'Villagers',
    type: 'character',
    tileType: 'villagers',
    icon: '👤',
    description: 'Villager character',
    quantity: 0
  }
];

function InventoryModal({ isOpen, onClose, onDragStart, unlockedItems }: InventoryModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  if (!isOpen) return null;

  // Toujours inclure grass et tree, et filtrer les autres selon le shop
  const availableItems = inventoryItems.filter(item =>
    item.id === 'grass' || item.id === 'tree' || unlockedItems.has(item.id)
  );

  const filteredItems = activeTab === 'all'
    ? availableItems
    : availableItems.filter(item => item.type === activeTab);

  const handleDragStart = (e: React.DragEvent, item: InventoryItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      item: item.tileType,
      fromSlot: -1 // -1 indique que ça vient de l'inventaire général
    }));
    onDragStart(item.tileType, -1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-slate-800 rounded-lg border-4 border-slate-700 w-11/12 max-w-4xl h-4/5 flex flex-col" style={{ marginBottom: '120px' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-400" />
            Inventory
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {[
            { id: 'all', label: 'All', icon: Grid3X3 },
            { id: 'material', label: 'Materials', icon: Package },
            { id: 'building', label: 'Buildings', icon: Hammer },
            { id: 'character', label: 'Character', icon: User }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                draggable={item.tileType !== null}
                onDragStart={(e) => handleDragStart(e, item)}
                className="bg-slate-700 rounded-lg border-2 border-slate-600 p-4 hover:border-slate-500 hover:bg-slate-600 transition-all cursor-grab"
                title={item.description}
              >
                <div className="text-center">
                  {item.tileType === 'grass' && (
                    <div className="w-full h-16 bg-green-500 relative mb-2 rounded">
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
                  {item.tileType === 'tree' && (
                    <div className="w-full h-16 bg-green-600 relative mb-2 rounded">
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-amber-800"></div>
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-700 rounded-sm"></div>
                      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-green-700 rounded-sm"></div>
                      <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-700 rounded-sm"></div>
                    </div>
                  )}
                  {item.tileType === 'water' && (
                    <div className="w-full h-16 bg-blue-400 relative mb-2 rounded flex items-center justify-center">
                      <Droplets className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                  {item.tileType === 'hut' && (
                    <div className="w-full h-16 relative mb-2 rounded flex items-center justify-center bg-slate-700">
                      <div className="w-12 h-12 relative">
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-7 bg-amber-900 border-2 border-amber-950"></div>
                        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-red-800 border-2 border-red-950" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-0.5 w-3 h-4 bg-amber-950"></div>
                      </div>
                    </div>
                  )}
                  {item.tileType === 'villagers' && (
                    <div className="w-full h-16 relative mb-2 rounded flex items-center justify-center bg-slate-700">
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
                  <div className="text-sm font-medium text-white">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryModal;
