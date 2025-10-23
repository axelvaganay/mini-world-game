import { useState, useEffect, useRef } from 'react';
import IsometricGrid from './components/IsometricGrid';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import InventoryModal from './components/InventoryModal';
import { Coins, Volume2, VolumeX, RotateCcw } from 'lucide-react';

export type TileType = 'grass' | 'tree' | 'water' | 'hut' | 'villagers' | 'eraser' | null;

interface FloatingText {
  id: number;
  amount: number;
  isPositive: boolean;
  location: 'inventory' | 'wallet';
}

function App() {
  const [selectedTile, setSelectedTile] = useState<TileType>('grass');
  const [placedTiles, setPlacedTiles] = useState<Record<string, TileType>>({});
  const [money, setMoney] = useState(100);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [inventorySlots, setInventorySlots] = useState<(TileType)[]>([
    'grass', 'tree', null, null, null, null, null, null, null, null
  ]);
  const [unlockedShopItems, setUnlockedShopItems] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const [placeAudio] = useState(() => {
    let audioContext: AudioContext | null = null;
    
    return () => {
      try {
        // Créer le contexte audio seulement quand nécessaire
        if (!audioContext) {
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        // Reprendre le contexte si il est suspendu (nécessaire pour les navigateurs modernes)
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      } catch (error) {
        // Ignorer les erreurs audio silencieusement pour éviter les erreurs sur certains navigateurs
        console.warn('Erreur audio:', error);
      }
    };
  });

  const tileCosts: Record<string, number> = {
    grass: 1,
    tree: 5,
    water: 0,
    hut: 0,
    villagers: 0,
  };

  useEffect(() => {
    if (floatingTexts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingTexts(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [floatingTexts]);

  // Initialiser la musique de fond
  useEffect(() => {
    if (backgroundMusicRef.current) {
      return;
    }

    // Créer l'élément audio pour la musique de fond
    const audio = new Audio('/audio/background-music.mp3');
    audio.loop = true;
    audio.volume = 0.3; // Volume plus doux pour la musique de fond
    audio.preload = 'auto';
    
    backgroundMusicRef.current = audio;

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Contrôler la lecture de la musique de fond
  useEffect(() => {
    if (!backgroundMusicRef.current) return;

    if (backgroundMusicEnabled) {
      backgroundMusicRef.current.play().catch((error) => {
        console.warn('Impossible de jouer la musique de fond:', error);
        setBackgroundMusicEnabled(false);
      });
    } else {
      backgroundMusicRef.current.pause();
    }
  }, [backgroundMusicEnabled]);

  // Gestion du zoom avec la molette
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
    setZoom(newZoom);
  };

  // Gestion du déplacement avec clic-glisser
  const handleMouseDown = (e: React.MouseEvent) => {
    // Seulement si on clique sur le conteneur principal, pas sur les tuiles
    if (e.target === e.currentTarget && (e.button === 1 || (e.button === 0 && e.ctrlKey))) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Réinitialiser la vue
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Gestion du drag & drop pour l'inventaire
  const handleInventoryDragStart = (item: TileType, fromSlot: number) => {
    // Cette fonction est appelée quand on commence à drag depuis l'inventaire modal
    console.log('Drag started from inventory:', item, fromSlot);
  };

  const handleUnlockShopItem = (itemId: string) => {
    const itemPrices: Record<string, number> = {
      water: 1,
      hut: 50,
      villagers: 0,
    };

    const price = itemPrices[itemId] || 0;

    if (money >= price) {
      setMoney(prev => prev - price);
      setUnlockedShopItems(prev => new Set([...prev, itemId]));

      const emptySlotIndex = inventorySlots.findIndex(slot => slot === null);
      if (emptySlotIndex !== -1) {
        const newSlots = [...inventorySlots];
        newSlots[emptySlotIndex] = itemId as TileType;
        setInventorySlots(newSlots);
      }

      const newText: FloatingText = {
        id: Date.now(),
        amount: price,
        isPositive: false,
        location: 'wallet'
      };
      setFloatingTexts(prev => [...prev, newText]);
    }
  };

  const handleTileClick = (tileId: string) => {
    // Initialiser l'audio au premier clic utilisateur
    if (!audioInitialized) {
      setAudioInitialized(true);
    }

    if (selectedTile === 'eraser') {
      // Vérifier si la tuile contient quelque chose avant de l'effacer
      const existingTile = placedTiles[tileId];
      if (existingTile) {
        // Effacer la tuile et regagner 1 pièce
        setPlacedTiles(prev => {
          const newTiles = { ...prev };
          delete newTiles[tileId];
          return newTiles;
        });
        
        // Ajouter 1 pièce
        setMoney(prev => prev + 1);

        // Afficher le texte flottant pour le gain en haut à droite
        const newText: FloatingText = {
          id: Date.now(),
          amount: 1,
          isPositive: true,
          location: 'wallet'
        };
        setFloatingTexts(prev => [...prev, newText]);
        
        // Jouer le son
        placeAudio();
      }
    } else if (selectedTile) {
      const cost = tileCosts[selectedTile] || 0;
      if (money >= cost) {
        setPlacedTiles(prev => ({
          ...prev,
          [tileId]: selectedTile
        }));
        setMoney(prev => prev - cost);

        // Afficher le texte flottant pour la perte au-dessus de l'inventaire
        const newText: FloatingText = {
          id: Date.now(),
          amount: cost,
          isPositive: false,
          location: 'inventory'
        };
        setFloatingTexts(prev => [...prev, newText]);

        placeAudio();
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="fixed top-8 right-8 flex items-center gap-4">
        <button
          onClick={() => setBackgroundMusicEnabled(!backgroundMusicEnabled)}
          className="bg-slate-800 px-4 py-3 rounded-lg border-4 border-slate-700 hover:border-slate-500 transition-all"
          title={backgroundMusicEnabled ? "Couper la musique" : "Activer la musique"}
        >
          {backgroundMusicEnabled ? (
            <Volume2 className="w-8 h-8 text-green-400" />
          ) : (
            <VolumeX className="w-8 h-8 text-slate-400" />
          )}
        </button>
        
        <button
          onClick={resetView}
          className="bg-slate-800 px-4 py-3 rounded-lg border-4 border-slate-700 hover:border-slate-500 transition-all"
          title="Réinitialiser la vue"
        >
          <RotateCcw className="w-8 h-8 text-blue-400" />
        </button>
        
        <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-lg border-4 border-slate-700">
          <Coins className="w-8 h-8 text-yellow-400" />
          <span className="text-3xl font-bold text-yellow-400">{money}</span>
        </div>
      </div>

      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className={`fixed text-3xl font-bold pointer-events-none flex items-center gap-2 ${
            ft.isPositive ? 'text-green-400' : 'text-red-400'
          }`}
          style={{
            ...(ft.location === 'wallet' ? {
              top: '120px',
              right: '32px',
              animation: 'floatUp 1s ease-out forwards'
            } : {
              bottom: '180px',
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'floatUp 1s ease-out forwards'
            })
          }}
        >
          <span>{ft.isPositive ? '+' : '-'}{ft.amount}</span>
          <Coins className="w-7 h-7 text-yellow-400" />
        </div>
      ))}

      <IsometricGrid
        placedTiles={placedTiles}
        onTileClick={handleTileClick}
        zoom={zoom}
        pan={pan}
      />
      <Inventory
        selectedTile={selectedTile}
        onSelectTile={setSelectedTile}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        inventorySlots={inventorySlots}
        onInventorySlotChange={setInventorySlots}
      />
      <Shop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        unlockedItems={unlockedShopItems}
        onUnlockItem={handleUnlockShopItem}
        currentMoney={money}
      />
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        onDragStart={handleInventoryDragStart}
      />
    </div>
  );
}

export default App;
