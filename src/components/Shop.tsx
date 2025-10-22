import { useState } from 'react';
import { X, Package, Home, User } from 'lucide-react';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'materials' | 'buildings' | 'character';

function Shop({ isOpen, onClose }: ShopProps) {
  const [activeTab, setActiveTab] = useState<TabType>('materials');

  if (!isOpen) return null;

  const renderItems = () => {
    const items = Array(12).fill(null);

    return (
      <div className="overflow-x-auto">
        <div className="grid grid-rows-3 gap-4 min-w-max">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-4">
              {items.slice(row * 4, (row + 1) * 4).map((_, index) => (
                <div
                  key={index}
                  className="w-24 h-24 bg-slate-600 border-4 border-slate-700 hover:border-slate-500 transition-all"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 border-4 border-slate-700 rounded-lg p-8 z-50 w-[600px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-100">Boutique</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded transition-all"
          >
            <X className="w-8 h-8 text-slate-300" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-6 py-3 rounded transition-all ${
              activeTab === 'materials'
                ? 'bg-slate-600 border-4 border-slate-300'
                : 'bg-slate-700 border-4 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Package className="w-5 h-5 text-slate-100" />
            <span className="text-lg font-semibold text-slate-100">Materials</span>
          </button>

          <button
            onClick={() => setActiveTab('buildings')}
            className={`flex items-center gap-2 px-6 py-3 rounded transition-all ${
              activeTab === 'buildings'
                ? 'bg-slate-600 border-4 border-slate-300'
                : 'bg-slate-700 border-4 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Home className="w-5 h-5 text-slate-100" />
            <span className="text-lg font-semibold text-slate-100">Buildings</span>
          </button>

          <button
            onClick={() => setActiveTab('character')}
            className={`flex items-center gap-2 px-6 py-3 rounded transition-all ${
              activeTab === 'character'
                ? 'bg-slate-600 border-4 border-slate-300'
                : 'bg-slate-700 border-4 border-slate-700 hover:border-slate-500'
            }`}
          >
            <User className="w-5 h-5 text-slate-100" />
            <span className="text-lg font-semibold text-slate-100">Character</span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {renderItems()}
        </div>
      </div>
    </>
  );
}

export default Shop;
