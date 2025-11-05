# Inventory Icon Components

This folder contains all inventory icon components displayed in the UI (inventory bar, shop, modals).

## Structure

Each icon is a separate component that renders the visual representation of an item in the inventory system.

## Components

- **GrassIcon**: Green tile with scattered darker spots
- **TreeIcon**: Tree with trunk and foliage layers
- **WaterIcon**: Blue background with water droplet icon
- **HutIcon**: Small house with roof and door
- **VillagersIcon**: Villager character sprite

## Usage

```tsx
import { TreeIcon } from './inventory-icons';

<TreeIcon />
```

## Future Migration

These components currently use CSS and HTML elements for rendering. In the future, they can be replaced with image sprites for better performance.

To migrate to images:
1. Replace the HTML structure with `<img>` tags
2. Point to sprite sheets in `/public/assets/icons/`
3. Use CSS sprites or individual image files
4. Keep the same component interface (no props required)
