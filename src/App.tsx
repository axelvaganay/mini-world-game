import { useState, useEffect } from 'react';
import IsometricGrid from './components/IsometricGrid';
import Inventory from './components/Inventory';
import { Coins } from 'lucide-react';

export type TileType = 'grass' | 'tree' | 'eraser' | null;

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}

function App() {
  const [selectedTile, setSelectedTile] = useState<TileType>('grass');
  const [placedTiles, setPlacedTiles] = useState<Record<string, TileType>>({});
  const [money, setMoney] = useState(100);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [placeAudio] = useState(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
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
    };
  });

  const tileCosts: Record<string, number> = {
    grass: 1,
    tree: 5,
  };

  useEffect(() => {
    if (floatingTexts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingTexts(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [floatingTexts]);

  const handleTileClick = (tileId: string) => {
    if (selectedTile === 'eraser') {
      setPlacedTiles(prev => {
        const newTiles = { ...prev };
        delete newTiles[tileId];
        return newTiles;
      });
    } else if (selectedTile) {
      const cost = tileCosts[selectedTile] || 0;
      if (money >= cost) {
        setPlacedTiles(prev => ({
          ...prev,
          [tileId]: selectedTile
        }));
        setMoney(prev => prev - cost);

        const newText: FloatingText = {
          id: Date.now(),
          text: `-${cost}`,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        };
        setFloatingTexts(prev => [...prev, newText]);

        coinAudio.currentTime = 0;
        coinAudio.play().catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
      <div className="fixed top-8 right-8 flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-lg border-4 border-slate-700">
        <Coins className="w-8 h-8 text-yellow-400" />
        <span className="text-3xl font-bold text-yellow-400">{money}</span>
      </div>

      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="fixed text-4xl font-bold text-yellow-400 animate-float pointer-events-none"
          style={{
            left: ft.x,
            top: ft.y,
            transform: 'translate(-50%, -50%)',
            animation: 'float 1s ease-out forwards'
          }}
        >
          {ft.text}
        </div>
      ))}

      <IsometricGrid
        placedTiles={placedTiles}
        onTileClick={handleTileClick}
      />
      <Inventory
        selectedTile={selectedTile}
        onSelectTile={setSelectedTile}
      />
    </div>
  );
}

export default App;
