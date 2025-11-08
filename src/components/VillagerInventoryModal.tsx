import { X, Package } from 'lucide-react';

interface VillagerInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  villagerId: string;
  inventory: {
    wood: number;
  };
}

function VillagerInventoryModal({ isOpen, onClose, villagerId, inventory }: VillagerInventoryModalProps) {
  if (!isOpen) return null;

  const [row, col] = villagerId.split('-').map(Number);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 rounded-lg border-4 border-slate-700 w-96 z-50">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-400" />
            Villager ({row}, {col})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-slate-700 rounded-lg p-4 border-2 border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-800 rounded flex items-center justify-center">
                  <span className="text-2xl">🪵</span>
                </div>
                <span className="text-lg font-semibold text-white">Wood</span>
              </div>
              <span className="text-2xl font-bold text-yellow-400">{inventory.wood}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VillagerInventoryModal;
