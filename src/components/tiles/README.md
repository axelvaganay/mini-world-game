# Tile Components

This folder contains all tile rendering components used in the isometric grid.

## Structure

Each tile is a separate component that renders the visual representation of a specific tile type in SVG format.

## Components

- **GrassTile**: Renders grass texture with scattered darker spots
- **TreeTile**: Renders a tree with trunk and layered foliage (includes grass base)
- **WaterTile**: Renders water with animated ripples and bubbles
- **HutTile**: Renders a building structure with roof and door (includes grass base)
- **StumpTile**: Renders a tree stump with rings (includes grass base)
- **VillagersTile**: Renders a villager character with animations (includes grass base)

## Usage

```tsx
import { TreeTile } from './tiles';

<TreeTile x={100} y={50} />
```

## Future Migration

These components are currently rendering procedural SVG graphics. In the future, they will be replaced with image-based rendering for better performance and visual quality.

To migrate to images:
1. Replace the SVG elements with `<image>` tags
2. Point to the appropriate image files in `/public/assets/tiles/`
3. Keep the same component interface (x, y props)
