import { useState, useEffect, useRef } from 'react';
import IsometricGrid from './components/IsometricGrid';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import InventoryModal from './components/InventoryModal';
import VillagerInventoryModal from './components/VillagerInventoryModal';
import { Coins, Volume2, VolumeX, RotateCcw, Pointer, Users } from 'lucide-react';
import { TILE_COSTS, SHOP_ITEM_PRICES } from './constants/tileCosts';
import { getHutTiles, areHutTilesEmpty } from './utils/tileUtils';

export type TileType = 'grass' | 'tree' | 'water' | 'hut' | 'villagers' | 'stump' | 'eraser' | null;

interface FloatingText {
  id: number;
  amount: number;
  isPositive: boolean;
  location: 'inventory' | 'wallet';
}

interface VillagerAction {
  tileId: string;
  action: 'cutting' | null;
  targetTree: string | null;
  startTime: number;
  animationPhase: number;
}

interface VillagerInventory {
  wood: number;
}


function App() {
  const [selectedTile, setSelectedTile] = useState<TileType>('grass');
  const [placedTiles, setPlacedTiles] = useState<Record<string, TileType>>({});
  const [money, setMoney] = useState(1000);
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
  const [hutPreviewTiles, setHutPreviewTiles] = useState<string[]>([]);
  const [villagerActions, setVillagerActions] = useState<Record<string, VillagerAction>>({});
  const [treeLocks, setTreeLocks] = useState<Set<string>>(new Set());
  const [villagerInventories, setVillagerInventories] = useState<Record<string, VillagerInventory>>({});
  const [selectedVillagerId, setSelectedVillagerId] = useState<string | null>(null);
  const [isInfoMode, setIsInfoMode] = useState(false);
  const [maxReachedShake, setMaxReachedShake] = useState(false);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  const countVillagers = () => {
    return Object.values(placedTiles).filter(tile => tile === 'villagers').length;
  };

  const countHuts = () => {
    return Object.values(placedTiles).filter(tile => tile === 'hut').length;
  };

  const maxVillagers = 2 + (countHuts() * 3);
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


  useEffect(() => {
    if (floatingTexts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingTexts(prev => prev.slice(1));
      }, 1500); // Augmenté de 1000ms à 1500ms pour correspondre à l'animation CSS
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

  // Système de mouvement autonome des villageois avec animation et coupe d'arbres
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPlacedTiles(prevTiles => {
        const newTiles = { ...prevTiles };
        const villagersToMove: string[] = [];

        // Trouver tous les villageois
        Object.keys(newTiles).forEach(tileId => {
          if (newTiles[tileId] === 'villagers') {
            villagersToMove.push(tileId);
          }
        });

        // Déplacer chaque villageois
        villagersToMove.forEach(tileId => {
          const [row, col] = tileId.split('-').map(Number);

          // Trouver les cases adjacentes (haut, bas, gauche, droite)
          const adjacentTiles = [
            { row: row - 1, col, id: `${row - 1}-${col}`, direction: 'up' },
            { row: row + 1, col, id: `${row + 1}-${col}`, direction: 'down' },
            { row, col: col - 1, id: `${row}-${col - 1}`, direction: 'left' },
            { row, col: col + 1, id: `${row}-${col + 1}`, direction: 'right' },
          ];

          // Vérifier s'il y a un arbre adjacent
          const adjacentTree = adjacentTiles.find(tile =>
            tile.row >= 0 && tile.row < 10 &&
            tile.col >= 0 && tile.col < 10 &&
            newTiles[tile.id] === 'tree'
          );

          if (adjacentTree) {
            // Commencer à couper l'arbre SEULEMENT si pas déjà en train de couper
            setVillagerActions(prev => {
              const current = prev[tileId];
              // ✅ Si déjà en train de couper, ne rien changer
              if (current && current.action === 'cutting') return prev;

              return {
                ...prev,
                [tileId]: {
                  tileId,
                  action: 'cutting',
                  targetTree: adjacentTree.id,
                  startTime: Date.now(),
                  animationPhase: 0,
                }
              };
            });
            return;
          }

          // Filtrer pour ne garder que les cases grass valides
          const validMoves = adjacentTiles.filter(tile =>
            tile.row >= 0 && tile.row < 10 &&
            tile.col >= 0 && tile.col < 10 &&
            newTiles[tile.id] === 'grass'
          );

          // Choisir une direction aléatoire si possible
          if (validMoves.length > 0) {
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

            // Échanger villager et grass
            newTiles[randomMove.id] = 'villagers';
            newTiles[tileId] = 'grass';

            // Transférer l'inventaire de l'ancienne case vers la nouvelle
            setVillagerInventories(prev => {
              const newInventories = { ...prev };

              // Si l'ancienne case avait un inventaire, le transférer
              if (newInventories[tileId]) {
                newInventories[randomMove.id] = newInventories[tileId];
                delete newInventories[tileId];
              }

              return newInventories;
            });

            // Transférer aussi l'action de coupe si elle existe
            setVillagerActions(prev => {
              if (prev[tileId]) {
                const newActions = { ...prev };
                newActions[randomMove.id] = {
                  ...prev[tileId],
                  tileId: randomMove.id
                };
                delete newActions[tileId];
                return newActions;
              }
              return prev;
            });
          }
        });

        return newTiles;
      });
    }, 2000);

    return () => clearInterval(moveInterval);
  }, []);

  // Vérifier les arbres finis de coupe
  useEffect(() => {
    Object.keys(villagerActions).forEach(villagerId => {
      const action = villagerActions[villagerId];
      if (action.action === 'cutting' && action.targetTree) {
        const elapsed = Date.now() - action.startTime;
        if (elapsed >= 10000) {
          setPlacedTiles(prev => ({
            ...prev,
            [action.targetTree!]: 'stump'
          }));
          setTreeLocks(prev => {
            const newLocks = new Set(prev);
            newLocks.delete(action.targetTree!);
            return newLocks;
          });
          setVillagerActions(prev => {
            const updated = { ...prev };
            delete updated[villagerId];
            return updated;
          });

          setMoney(prev => prev + 2);

          const moneyText: FloatingText = {
            id: Date.now(),
            amount: 2,
            isPositive: true,
            location: 'wallet'
          };
          setFloatingTexts(prev => [...prev, moneyText]);

          setVillagerInventories(prev => ({
            ...prev,
            [villagerId]: {
              wood: (prev[villagerId]?.wood || 0) + 1
            }
          }));
        }
      }
    });
  }, [villagerActions]);

  // Gestion de l'animation de coupe d'arbre
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setVillagerActions(prevActions => {
        const now = Date.now();
        const updated = { ...prevActions };

        Object.keys(updated).forEach(villagerId => {
          const action = updated[villagerId];
          if (action.action === 'cutting' && action.targetTree) {
            const elapsed = now - action.startTime;
            const newPhase = Math.floor((elapsed % 1500) / 500);
            updated[villagerId] = { ...action, animationPhase: newPhase };
          }
        });

        return updated;
      });
    }, 100);

    return () => clearInterval(animationInterval);
  }, []);

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

  const handleTileHover = (tileId: string) => {
    if (selectedTile === 'hut') {
      const hutTiles = getHutTiles(tileId);
      if (areHutTilesEmpty(hutTiles, placedTiles)) {
        setHutPreviewTiles(hutTiles);
      } else {
        setHutPreviewTiles([]);
      }
    } else {
      setHutPreviewTiles([]);
    }
  };

  const handleTileLeave = () => {
    setHutPreviewTiles([]);
  };

  // Gestion du drag & drop pour l'inventaire
  const handleInventoryDragStart = (item: TileType, fromSlot: number) => {
    // Cette fonction est appelée quand on commence à drag depuis l'inventaire modal
    console.log('Drag started from inventory:', item, fromSlot);
  };

  const handleUnlockShopItem = (itemId: string) => {
    const price = SHOP_ITEM_PRICES[itemId] || 0;

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

    if (isInfoMode) {
      if (placedTiles[tileId] === 'villagers') {
        setSelectedVillagerId(tileId);
      }
      return;
    }

    if (placedTiles[tileId] === 'villagers') {
      setSelectedVillagerId(tileId);
      return;
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
    } else if (selectedTile === 'hut') {
      const hutTiles = getHutTiles(tileId);
      const cost = TILE_COSTS[selectedTile] || 0;

      if (money >= cost && areHutTilesEmpty(hutTiles, placedTiles)) {
        // Placer la hutte aligné sur la tuile du bas
        const [row, col] = tileId.split('-').map(Number);
        const bottomRightTile = `${row + 1}-${col + 1}`;
        setPlacedTiles(prev => ({
          ...prev,
          [bottomRightTile]: 'hut' // Placer sur la case la plus basse
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
    } else if (selectedTile === 'villagers') {
      const cost = TILE_COSTS[selectedTile] || 0;
      const currentVillagers = countVillagers();

      if (currentVillagers >= maxVillagers) {
        setMaxReachedShake(true);
        setTimeout(() => setMaxReachedShake(false), 500);
        return;
      }

      if (money >= cost) {
        setPlacedTiles(prev => ({
          ...prev,
          [tileId]: selectedTile
        }));
        setMoney(prev => prev - cost);

        const newText: FloatingText = {
          id: Date.now(),
          amount: cost,
          isPositive: false,
          location: 'inventory'
        };
        setFloatingTexts(prev => [...prev, newText]);

        placeAudio();
      }
    } else if (selectedTile) {
      const cost = TILE_COSTS[selectedTile] || 0;
      if (money >= cost) {
        setPlacedTiles(prev => ({
          ...prev,
          [tileId]: selectedTile
        }));
        setMoney(prev => prev - cost);

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
      <div className="fixed top-8 left-8 flex items-center gap-4 z-50">
        <div className={`flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-lg border-4 transition-colors ${
          maxReachedShake ? 'border-red-500' : 'border-slate-700'
        }`}>
          <Users className={`w-8 h-8 ${maxReachedShake ? 'text-red-500' : 'text-cyan-400'}`} />
          <span className={`text-3xl font-bold ${maxReachedShake ? 'shake-red' : 'text-cyan-400'}`}>
            {countVillagers()}/{maxVillagers}
          </span>
        </div>
      </div>

      <div className="fixed top-8 right-8 flex items-center gap-4 z-50">
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
          className={`fixed text-4xl font-bold pointer-events-none flex items-center gap-2 z-[100] animate-float ${
            ft.isPositive ? 'text-green-400' : 'text-red-400'
          }`}
          style={{
            ...(ft.location === 'wallet' ? {
              top: '120px',
              right: '32px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            } : {
              bottom: '180px',
              left: '50%',
              transform: 'translateX(-50%)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            })
          }}
        >
          <span className="drop-shadow-lg">{ft.isPositive ? '+' : '-'}{ft.amount}</span>
          <Coins className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
        </div>
      ))}

      <IsometricGrid
        placedTiles={placedTiles}
        onTileClick={handleTileClick}
        onTileHover={handleTileHover}
        onTileLeave={handleTileLeave}
        zoom={zoom}
        pan={pan}
        hutPreviewTiles={hutPreviewTiles}
        villagerActions={villagerActions}
      />
      <div className="fixed bottom-8 right-8 flex items-center gap-3 z-40">
        <button
          onClick={() => setIsInfoMode(!isInfoMode)}
          className={`px-4 py-3 rounded-lg border-4 transition-all ${
            isInfoMode
              ? 'bg-blue-600 border-blue-400'
              : 'bg-slate-800 border-slate-700 hover:border-slate-500'
          }`}
          title={isInfoMode ? "Désactiver le mode info" : "Activer le mode info"}
        >
          <Pointer className={`w-8 h-8 ${isInfoMode ? 'text-white' : 'text-slate-400'}`} />
        </button>
      </div>

      <Inventory
        selectedTile={selectedTile}
        onSelectTile={setSelectedTile}
        onOpenShop={() => setIsShopOpen(!isShopOpen)}
        onOpenInventory={() => setIsInventoryOpen(!isInventoryOpen)}
        inventorySlots={inventorySlots}
        onInventorySlotChange={setInventorySlots}
        isShopOpen={isShopOpen}
        isInventoryOpen={isInventoryOpen}
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
        unlockedItems={unlockedShopItems}
      />
      <VillagerInventoryModal
        isOpen={selectedVillagerId !== null}
        onClose={() => setSelectedVillagerId(null)}
        villagerId={selectedVillagerId || ''}
        inventory={selectedVillagerId ? (villagerInventories[selectedVillagerId] || { wood: 0 }) : { wood: 0 }}
      />
    </div>
  );
}

export default App;
