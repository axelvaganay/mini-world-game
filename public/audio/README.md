# 🎵 Instructions pour ajouter la musique de fond

## Comment ajouter votre fichier audio :

1. **Placez votre fichier audio** dans ce dossier (`public/audio/`)
2. **Renommez-le** en `background-music.mp3` (ou modifiez le nom dans App.tsx ligne 81)
3. **Formats recommandés** :
   - **MP3** : Le plus compatible avec tous les navigateurs
   - **OGG** : Meilleure compression, supporté par la plupart des navigateurs
   - **WAV** : Qualité maximale mais fichier plus lourd

## Optimisations pour le web :

### Taille de fichier recommandée :
- **Moins de 2MB** pour un chargement rapide
- **Durée** : 30-60 secondes (elle se répète automatiquement)
- **Qualité** : 128kbps MP3 suffit pour la musique de fond

### Conseils :
- Utilisez des outils comme Audacity pour réduire la taille
- Privilégiez des musiques instrumentales et douces
- Testez sur mobile pour vérifier la compatibilité

## Sites pour trouver de la musique libre de droits :
- **Freesound.org** : Sons et musiques gratuits
- **Zapsplat** : Bibliothèque audio professionnelle (gratuit avec compte)
- **YouTube Audio Library** : Musiques gratuites de Google
- **Incompetech** : Musiques de Kevin MacLeod (libres d'usage)

## Exemple de structure finale :
```
public/
└── audio/
    └── background-music.mp3  ← Votre fichier ici
```

Une fois le fichier ajouté, la musique se lancera automatiquement quand l'utilisateur cliquera sur le bouton audio ! 🎮
