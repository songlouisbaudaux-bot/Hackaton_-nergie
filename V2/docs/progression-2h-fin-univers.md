# Progression 2h+ - Fin de l'univers

## Objectif

Conserver le debut actuel, puis prolonger le jeu apres l'age atomique jusqu'a une fin lisible. La partie ne doit plus s'arreter au coeur de reacteur : le joueur passe dans une progression speculative inspiree des docs `eres-spatiales`.

## Structure jouable

1. Prehistoire
2. Antiquite
3. Moyen Age
4. Age industriel
5. Age atomique
6. Fusion controlee
7. Solaire orbital
8. Puits de neutrons
9. Antimatiere
10. Trou noir
11. Dyson
12. Vide

Le debut reste volontairement rapide. La difficulte augmente apres l'atome avec des couts de transition beaucoup plus hauts et des productions en millions puis milliards de joules par seconde.

## Pacing verifie

La commande `npm run simulate:pacing` simule la progression complete avec plusieurs profils joueur.

Resultats actuels :

- parcours minimal, un achat de chaque objet et technologie, 1 clic/s : environ 126,7 minutes ;
- parcours agressif, achats repetes de l'age courant avec retour sur investissement de 10 minutes maximum, 1 clic/s : environ 120,0 minutes ;
- parcours calme, 0,35 clic/s et achats repetes seulement si rentables sous 7 minutes : environ 124,7 minutes ;
- garde-fou automatique : la commande echoue si la simulation la plus courte passe sous 120 minutes.

Le dernier rapport garde les moments forts a moins de 15 minutes les uns des autres sur les trois profils.

## Fin

La derniere ere est `Vide`. Quand tous les objets et technologies de cette ere sont termines, le jeu affiche `Le vide repond` avec trois lectures de fin :

- `Partage` : l'energie du vide est ouverte a toutes les civilisations.
- `Silence` : la civilisation devient indetectable.
- `Recommencement` : une nouvelle graine d'univers relance la boucle.

Le bouton `Recommencer l'univers` reset la partie comme le bouton `Recommencer`.

## Regles de design

- Pas de nouveau menu ouvrant.
- Les achats restent dans le panneau de droite.
- Les technologies restent dans le rail du bas.
- Le mix energetique reste la representation principale des sources.
- Les sources ne remplacent pas les anciennes : elles s'accumulent.
- Le rail d'ages affiche une fenetre compacte autour de l'age courant pour eviter la surcharge.

## Assets

Les nouvelles eres utilisent pour l'instant les assets disponibles :

- fusion : images atomiques/fusion deja generees ;
- solaire orbital : `images-finales-gpt-image/orbital-solar/island-orbital-solar-07-built-collector.png` ;
- antimatiere : images atomiques/antimatiere deja generees ;
- Dyson : `images-finales-gpt-image/dyson/island-dyson-11-built-stellar-swarm.png` et rendu CSS de fin cosmique ;
- puits de neutrons : `cosmic/island-cosmic-08-neutron-wells.png` ;
- trou noir : `cosmic/island-cosmic-10-black-hole-siphon.png` ;
- vide : `cosmic/island-cosmic-12-vacuum-universe-seed.png`.

Les assets specifiques de fin sont maintenant integres dans `public/assets/game/images-finales-gpt-image`.
