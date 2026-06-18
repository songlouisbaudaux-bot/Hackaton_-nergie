# Prometheus Protocol - Trame du jeu

## Vision

Prometheus Protocol est un jeu incremental sur l'histoire de l'energie.
Le joueur part d'un campement primitif et traverse des ages historiques en ajoutant progressivement de nouvelles sources d'energie.

La regle centrale est simple :

- les joules sont la seule ressource visible ;
- chaque age ajoute une nouvelle famille d'energie ;
- les anciennes energies restent dans le mix ;
- les objets peuvent etre achetes plusieurs fois ;
- les technologies sont uniques et font evoluer un objet deja construit.

Le centre de l'ecran reste reserve aux futurs assets du village ou de l'ile. Pour l'instant il sert seulement de zone cliquable invisible.

## Boucle principale

1. Le joueur clique au centre pour produire des joules.
2. Il achete des objets energetiques dans le shop de l'age actif.
3. Chaque objet augmente le gain au clic, la production passive, ou les deux.
4. Il peut acheter plusieurs exemplaires du meme objet.
5. Le cout du prochain exemplaire augmente progressivement.
6. Les technologies disponibles en bas ameliorent les objets existants.
7. Quand les objets et technologies requis de l'age sont faits, le joueur peut passer a l'age suivant.

## Interface actuelle

- Haut centre : compteur de joules, J/clic, J/s.
- Gauche : mix energetique, avec parts de chaque source active.
- Centre : emplacement vide reserve aux futurs assets.
- Droite : shop de l'age actif, uniquement des objets achetables.
- Bas : technologies de l'age actif, qui evoluent les objets construits.
- Bas final : progression historique des ages.

Il n'y a pas de menus ouvrants, pas de drawer et pas de modal pour jouer.

## Assets et icones

La liste complete des icones, assets disponibles et assets a produire est documentee dans `docs/liste-icones-assets.md`.
La liste des iles volantes a generer pour le monde central et les sources d'energie est documentee dans `docs/liste-iles-volantes-assets.md`.

Regle visuelle pour les iles : chaque ile d'energie se debloque avec son age, puis evolue avec les technologies qui correspondent aux objets achetes. Les iles doivent rester des variations d'une meme ile vierge, pas une collection d'assets sans lien visuel.

## Ages et sources

### 1. Prehistoire

Nouvelle source : biomasse.

Objet :

- Feu de camp : premier objet energetique, achetable plusieurs fois.

Technologie :

- Conservation de la braise : evolue Feu de camp.

Intention :

Le joueur comprend que l'energie commence par un geste humain simple : alimenter le feu, stocker la chaleur, transformer le bois et la nourriture en energie utile.

### 2. Neolithique

Nouvelle source : elevage / force animale.

Objets :

- Foyer en pierre : nouvelle forme de biomasse plus stable.
- Boeufs de traction : premiere force animale utile.

Technologies :

- Foyer maconne : evolue Foyer en pierre.
- Domestication de traction : evolue Boeufs de traction.

Intention :

L'age ne remplace pas la biomasse. Il ajoute la force animale, tandis que le feu continue a s'ameliorer.

### 3. Moyen Age

Nouvelle source : eau et vent.

Objets :

- Four a charbon de bois : biomasse plus dense.
- Charrue lourde : force animale plus efficace.
- Moulin a eau : premiere puissance mecanique continue.

Technologies :

- Charbonnage : evolue Four a charbon de bois.
- Collier d'epaule : evolue Charrue lourde.
- Moulin a vent : evolue Moulin a eau vers une logique eau/vent.

Intention :

Le joueur voit apparaitre les energies renouvelables mecaniques. La puissance ne vient plus seulement du corps ou du feu, mais aussi du paysage.

### 4. Age industriel

Nouvelle source : fossile / vapeur.

Objets :

- Gazogene a bois : biomasse industrialisee.
- Relais de chevaux : force animale encore utile.
- Pompe a vent : renouvelable mecanique specialisee.
- Machine a vapeur : entree du fossile.

Technologies :

- Gaz de bois : evolue Gazogene a bois.
- Haras logistiques : evolue Relais de chevaux.
- Pompes mecaniques : evolue Pompe a vent.
- Vapeur haute pression : evolue Machine a vapeur.

Intention :

Le fossile apporte une densite massive, mais les anciennes energies ne disparaissent pas. Elles deviennent des sous-systemes, des appoints ou des infrastructures.

### 5. Age atomique

Nouvelle source : energie de l'atome.

Objets :

- Digesteur biogaz : biomasse moderne.
- Logistique alimentaire : elevage organise comme flux.
- Reseau hydro-eolien : eau et vent raccordes au reseau.
- Turbine thermique : fossile mieux encadre.
- Coeur de reacteur : entree de l'atome.

Technologies :

- Methanisation : evolue Digesteur biogaz.
- Chaine alimentaire : evolue Logistique alimentaire.
- Eoliennes modernes : evolue Reseau hydro-eolien.
- Cycle thermique : evolue Turbine thermique.
- Fission controlee : evolue Coeur de reacteur.

Intention :

L'atome ne supprime pas tout le reste. Il devient la source tres dense autour de laquelle le mix moderne se recompose.

## Regles de shop

- Le shop affiche seulement les objets de l'age actif.
- Les objets sont achetables a l'infini.
- Le compteur `xN` indique combien d'exemplaires existent.
- Le cout affiche est toujours le cout du prochain exemplaire.
- Les cartes du shop restent courtes : source, nom, gain, cout, compteur.
- Les descriptions longues ne sont pas affichees dans le shop.

## Regles de technologies

- Les technologies sont affichees en bas, par age actif.
- Une technologie est unique : elle ne s'achete qu'une fois.
- Une technologie cible toujours un objet existant.
- Si l'objet cible n'a pas encore ete construit, la technologie reste verrouillee.
- Une technologie represente une evolution du bati ou de l'infrastructure, pas un nouveau batiment achetable.

Exemple :

- Objet : Moulin a eau.
- Technologie : Moulin a vent.
- Plus tard : Reseau hydro-eolien puis Eoliennes modernes.

## Passage d'age

Pour passer a l'age suivant :

1. Acheter au moins un exemplaire de chaque objet de l'age actif.
2. Rechercher les technologies de l'age actif.
3. Payer le cout de passage en joules.

Le passage d'age debloque un nouveau shop historique et une nouvelle source d'energie.

## Journal d'implementation

### 2026-06-18

- Creation du modele `PurchaseCounts` pour permettre plusieurs exemplaires d'un meme objet.
- Separation entre objets repetables et technologies uniques.
- Ajout de technologies par age et par source.
- Ajout d'une cible d'objet pour chaque technologie avec `targetPurchaseId`.
- Deplacement des technologies dans un rail bas separe du shop.
- Nettoyage du shop : suppression des commentaires longs sous chaque case.
- Conservation du centre vide pour les futurs assets.
- Verification du build Vite / TypeScript.

### 2026-06-18 - Passe technologies

- Les technologies ont ete sorties du panneau de shop.
- Ajout d'un rail `Technologies` en bas de l'interface.
- Chaque technologie affiche l'objet qu'elle fait evoluer, par exemple `Feu de camp x1`.
- Une technologie reste verrouillee tant que son objet cible n'existe pas.
- Le shop garde uniquement les objets repetables et leur compteur `xN`.
- Verification runtime : achat de Feu de camp, deblocage de Conservation de la braise, puis recherche de la technologie.

### 2026-06-18 - Liste icones/assets

- Ajout de `docs/liste-icones-assets.md`.
- Classement des assets deja disponibles dans `public/assets/game/`.
- Liste des assets ideaux a produire pour chaque objet et technologie.
- Priorisation des assets manquants pour les prochaines passes de production.

### 2026-06-18 - Liste iles volantes

- Ajout de `docs/liste-iles-volantes-assets.md`.
- Definition d'une ile centrale et d'une ile par famille d'energie du mix.
- Ajout des evolutions visuelles par technologie : feu vers biomasse moderne, moulin vers barrage/eolien, charbon vers petrole/gaz, fission vers futur.

### 2026-06-18 - Regle variations d'ile

- Reorganisation de `docs/liste-iles-volantes-assets.md`.
- Clarification : toutes les iles sont des variations d'une ile vierge commune.
- Clarification : une ile d'energie apparait seulement quand son age est debloque.
- Clarification : chaque technologie doit correspondre a l'objet qu'elle ameliore visuellement.

### 2026-06-18 - HUD statique responsive

- Retour a une fenetre de jeu fixe : pas de page qui defile vers le bas.
- Conservation des zones autour du centre : mix a gauche, shop a droite, technologies et progression en bas.
- Les panneaux adaptent leur largeur et leur hauteur a la fenetre.
- Quand il y a trop d'elements, seul le contenu du panneau scrolle, pas toute la page.
