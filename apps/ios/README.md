# Prometheus Protocol iOS

Cette app Capacitor embarque le build web de `V2/dist`.

## Workflow
```bash
cd ../../V2
npm run build
npm run ios:sync
npm run ios:open
```

## Notes
- Ne pas modifier le gameplay dans ce dossier.
- Les changements de jeu se font dans `V2/src`.
- Le dossier iOS sert seulement a packager et configurer l'app native.
