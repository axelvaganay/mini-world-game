import { X, Lock } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemName: string;
  itemPrice: number;
  currentMoney: number;
  onPurchase: () => void;
  renderItemIcon: () => JSX.Element;
}

function PurchaseModal({
  isOpen,
  onClose,
  itemName,
  itemPrice,
  currentMoney,
  onPurchase,
  renderItemIcon,
}: PurchaseModalProps) {
  if (!isOpen) return null;

  const canAfford = currentMoney >= itemPrice;

  const handlePurchase = () => {
    if (canAfford) {
      onPurchase();
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-[60]"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 border-4 border-slate-700 rounded-lg p-8 z-[70] w-[400px]">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition-all"
          >
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 bg-slate-700 border-4 border-slate-600 flex items-center justify-center">
            {renderItemIcon()}
          </div>

          <h3 className="text-2xl font-bold text-slate-100 capitalize">
            {itemName}
          </h3>

          <button
            onClick={handlePurchase}
            disabled={!canAfford}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg border-4 transition-all ${
              canAfford
                ? 'bg-green-700 border-green-600 hover:bg-green-600 cursor-pointer'
                : 'bg-slate-700 border-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <Lock className="w-6 h-6 text-slate-100" />
            <span className="text-xl font-bold text-slate-100">{itemPrice}</span>
            <span className="text-xl font-bold text-yellow-400">coins</span>
          </button>

          {!canAfford && (
            <p className="text-red-400 text-sm font-semibold">
              Insufficient funds
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default PurchaseModal;
