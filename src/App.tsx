import { useState, useEffect, useRef } from 'react';
import IsometricGrid from './components/IsometricGrid';
import Inventory from './components/Inventory';
import { Coins, Volume2, VolumeX } from 'lucide-react';

export type TileType = 'grass' | 'tree' | 'eraser' | null;

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  isPositive?: boolean;
}

function App() {
  const [selectedTile, setSelectedTile] = useState<TileType>('grass');
  const [placedTiles, setPlacedTiles] = useState<Record<string, TileType>>({});
  const [money, setMoney] = useState(100);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(false);
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
        
        // Afficher le texte flottant pour le gain
        const newText: FloatingText = {
          id: Date.now(),
          text: '+1',
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          isPositive: true
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

        const newText: FloatingText = {
          id: Date.now(),
          text: `-${cost}`,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          isPositive: false
        };
        setFloatingTexts(prev => [...prev, newText]);

        placeAudio();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
      <div className="fixed top-8 right-8 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-lg border-4 border-slate-700">
          <Coins className="w-8 h-8 text-yellow-400" />
          <span className="text-3xl font-bold text-yellow-400">{money}</span>
        </div>
        
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
      </div>

      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className={`fixed text-4xl font-bold animate-float pointer-events-none ${
            ft.isPositive ? 'text-green-400' : 'text-red-400'
          }`}
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
