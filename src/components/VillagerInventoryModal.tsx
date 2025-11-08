import { X } from 'lucide-react';

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

  const inventorySlots = [
    { label: 'Wood', value: inventory.wood, emoji: '🪵', color: 'bg-amber-700' },
    { label: 'Empty', value: 0, emoji: '?', color: 'bg-slate-600' },
    { label: 'Empty', value: 0, emoji: '?', color: 'bg-slate-600' },
    { label: 'Empty', value: 0, emoji: '?', color: 'bg-slate-600' },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border-4 border-slate-600 w-80 z-50 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <h2 className="text-xl font-bold text-white">
            Villager ({row}, {col})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {inventorySlots.map((slot, index) => (
              <div
                key={index}
                className={`${slot.color} rounded-lg p-4 border-2 border-slate-500 flex flex-col items-center justify-center min-h-24 transition-all hover:border-slate-400`}
              >
                <div className="text-3xl mb-2">{slot.emoji}</div>
                <div className="text-xs text-slate-300 text-center mb-1">{slot.label}</div>
                <div className="text-lg font-bold text-white">{slot.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default VillagerInventoryModal;
