# Prometheus Protocol V2

V2 est une copie autonome de la version finale actuelle du jeu, gardee dans un sous-dossier pour pouvoir allonger et equilibrer le jeu sans casser la V1.

## Lancer

```bash
npm install
npm run dev
```

## Verifier

```bash
npm run build
npm run simulate:pacing
npm run balance:auto
npm run balance:loop
```

## Objectif V2

- Garder le jeu en interface directe, sans menus profonds.
- Garder les iles finales et les transitions d'age de la V1 recente.
- Allonger la progression pour viser au moins 2 heures.
- Eviter que les achats repetables cassent le pacing.
- Continuer a iterer avec une boucle de simulation, pas seulement au feeling.

## Etat de cette premiere passe

- Sauvegarde locale separee de la V1.
- Titre et package renommes en V2.
- Assets runtime nettoyes : la V2 charge uniquement `public/assets/game/images-finales-gpt-image`.
- Parcelles non construites rendues opaques, comme des iles vides normales.
- Objectif courant compact dans le HUD : prochain achat, technologie ou passage d'age.
- Croissance des achats repetables calibree par simulation.
- Rapport d'equilibrage avec diagnostic des ages trop rapides ou trop lents.
- Target simulation : 120 minutes minimum.
- Run obligatoire simule : 130.6 min.
- Run optimiste avec achats repetables rentables : 121.6 min.

La suite V2 doit maintenant travailler le fun minute par minute : objectifs intermediaires, meilleurs choix par age, feedbacks plus lisibles, et fin plus scenarisee.
