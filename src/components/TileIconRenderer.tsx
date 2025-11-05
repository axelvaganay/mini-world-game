import { TileType } from '../App';
import GrassIcon from './inventory-icons/GrassIcon';
import TreeIcon from './inventory-icons/TreeIcon';
import WaterIcon from './inventory-icons/WaterIcon';
import HutIcon from './inventory-icons/HutIcon';
import VillagersIcon from './inventory-icons/VillagersIcon';

interface TileIconRendererProps {
  tileType: TileType;
}

function TileIconRenderer({ tileType }: TileIconRendererProps) {
  switch (tileType) {
    case 'grass':
      return <GrassIcon />;
    case 'tree':
      return <TreeIcon />;
    case 'water':
      return <WaterIcon />;
    case 'hut':
      return <HutIcon />;
    case 'villagers':
      return <VillagersIcon />;
    default:
      return null;
  }
}

export default TileIconRenderer;
