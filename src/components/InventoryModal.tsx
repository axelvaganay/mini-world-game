import { useState } from 'react';
import { X, Package, Hammer, User, Grid3X3 } from 'lucide-react';
import { TileType } from '../App';
import TileIconRenderer from './TileIconRenderer';

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
                  <div className="w-full h-16 relative mb-2 rounded">
                    <TileIconRenderer tileType={item.tileType} />
                  </div>
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
