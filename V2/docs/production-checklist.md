# Checklist production V2

## Commande principale
```bash
npm run check:prod
```

Cette commande lance :
- build TypeScript + Vite ;
- simulation de pacing ;
- audit des images runtime.

## Verification manuelle rapide
- Intro video : visible, bouton passer fonctionnel.
- Audio : bouton son en haut a droite, clic central audible apres interaction, mute persistant.
- Gameplay : achat, technologie, passage d'age, reset, bac a sable.
- Iles : pas d'ancien set, pas d'image manquante.
- Mobile paysage : panneaux lisibles, iles visibles, pas de chevauchement majeur.
- Mobile portrait : overlay de rotation visible.
- PWA : manifest accessible, service worker enregistre, icone visible a l'installation.
- Fin cosmique : affichage, son de fin, bouton recommencer.

## Gates avant push
```bash
npm run check:prod
git status --short
git push origin main
git ls-remote origin refs/heads/main
```

## Notes d'equilibrage
- Le facteur de boost techno par batiment est `0.35`.
- La simulation actuelle garde un run le plus rapide au-dessus de 2h.
- Les creux tardifs restent a surveiller, surtout Dyson vers Vide.
