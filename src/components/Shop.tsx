import { useState, useRef, useEffect } from 'react';
import { X, Home, User, Square, Droplets, Lock } from 'lucide-react';
import PurchaseModal from './PurchaseModal';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedItems: Set<string>;
  onUnlockItem: (itemId: string) => void;
  currentMoney: number;
}

type TabType = 'materials' | 'buildings' | 'character';

type ShopItem = {
  id: string;
  name: string;
  price: number;
  tab: TabType;
  position: number;
};

const SHOP_ITEMS: ShopItem[] = [
  { id: 'water', name: 'water', price: 1, tab: 'materials', position: 0 },
  { id: 'hut', name: 'hut', price: 50, tab: 'buildings', position: 0 },
  { id: 'villagers', name: 'villagers', price: 0, tab: 'character', position: 0 },
];

function Shop({ isOpen, onClose, unlockedItems, onUnlockItem, currentMoney }: ShopProps) {
  const [activeTab, setActiveTab] = useState<TabType>('materials');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleItemClick = (item: ShopItem) => {
    if (!unlockedItems.has(item.id)) {
      setSelectedItem(item);
      setPurchaseModalOpen(true);
    }
  };

  const handlePurchase = () => {
    if (selectedItem && currentMoney >= selectedItem.price) {
      onUnlockItem(selectedItem.id);
    }
  };

  const renderItemIcon = (tab: TabType, globalIndex: number) => {
    if (tab === 'materials' && globalIndex === 0) {
      return <Droplets className="w-16 h-16 text-blue-400" />;
    }
    if (tab === 'buildings' && globalIndex === 0) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-10 bg-amber-900 border-2 border-amber-950"></div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-red-800 border-2 border-red-950" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-x-1 w-4 h-5 bg-amber-950"></div>
          </div>
        </div>
      );
    }
    if (tab === 'character' && globalIndex === 0) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-12 h-16 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-200 rounded-full border-2 border-amber-300"></div>
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-8 h-7 bg-blue-600 border-2 border-blue-700"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-5 bg-amber-800">
              <div className="absolute top-0 left-0 w-3.5 h-full bg-amber-800"></div>
              <div className="absolute top-0 right-0 w-3.5 h-full bg-amber-800"></div>
            </div>
            <div className="absolute top-6 left-0 w-3 h-5 bg-amber-200 rounded-sm"></div>
            <div className="absolute top-6 right-0 w-3 h-5 bg-amber-200 rounded-sm"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderItems = (tab: TabType) => {
    const totalColumns = 10;
    const items = Array(totalColumns * 3).fill(null);

    return (
      <div key={tab} ref={scrollContainerRef} className="overflow-x-auto pb-2">
        <div className="grid grid-rows-3 gap-4 min-w-max">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-4">
              {items.slice(row * totalColumns, (row + 1) * totalColumns).map((_, index) => {
                const globalIndex = row * totalColumns + index;
                const shopItem = SHOP_ITEMS.find(
                  item => item.tab === tab && item.position === globalIndex
                );
                const isLocked = shopItem && !unlockedItems.has(shopItem.id);

                return (
                  <div
                    key={`${tab}-${index}`}
                    className={`w-24 h-24 bg-slate-600 border-4 border-slate-700 transition-all flex-shrink-0 flex items-center justify-center relative ${
                      shopItem ? 'hover:border-slate-500 cursor-pointer' : ''
                    }`}
                    onClick={() => shopItem && handleItemClick(shopItem)}
                  >
                    {renderItemIcon(tab, globalIndex)}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-yellow-400" />
                      </div>
                    )}
                  </div>
                );
              })}
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
        <div className="flex justify-center items-center mb-6 relative">
          <img
            src="/asset/shop.png"
            alt="SHOP"
            className="h-16 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <h2 className="text-4xl font-bold text-yellow-400 tracking-wider hidden">SHOP</h2>
          <button
            onClick={onClose}
            className="absolute right-0 p-2 hover:bg-slate-700 rounded transition-all"
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
            <Square className="w-5 h-5 text-amber-600 fill-amber-700" />
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
          {renderItems(activeTab)}
        </div>
      </div>

      {selectedItem && (
        <PurchaseModal
          isOpen={purchaseModalOpen}
          onClose={() => {
            setPurchaseModalOpen(false);
            setSelectedItem(null);
          }}
          itemId={selectedItem.id}
          itemName={selectedItem.name}
          itemPrice={selectedItem.price}
          currentMoney={currentMoney}
          onPurchase={handlePurchase}
          renderItemIcon={() => renderItemIcon(selectedItem.tab, selectedItem.position)}
        />
      )}
    </>
  );
}

export default Shop;
