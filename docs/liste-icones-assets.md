# Liste des icones et assets necessaires

Ce fichier liste les icones/assets utiles pour la version actuelle de Prometheus Protocol.

Le centre du jeu reste reserve aux assets futurs. Pour l'instant, les assets servent surtout aux cartes du shop, aux technologies, au mix energetique et a l'intro.

La liste des grandes iles volantes a generer pour le monde central est separee dans `docs/liste-iles-volantes-assets.md`.

## Regles visuelles

- Style : 3D minimaliste, toy-like, legerement isometrique.
- Format attendu : PNG transparent.
- Pas de texte dans les images.
- Silhouette lisible en petit, car les assets apparaissent dans des cartes compactes.
- Un asset peut servir a la fois pour l'objet achetable et sa technologie associee si la forme reste claire.

## Assets deja disponibles

Ces fichiers existent deja dans `public/assets/game/` et peuvent etre utilises tout de suite :

- `campfire.png`
- `stone-hearth.png`
- `ox.png`
- `logs.png`
- `plough.png`
- `water-wheel.png`
- `boiler.png`
- `horse.png`
- `windmill.png`
- `steam-engine.png`
- `food-cache.png`
- `granary.png`
- `small-factory.png`
- `fire-glow.png`
- `terrain.png`
- `tree.png`
- `bush-cluster.png`
- `food.png`
- `field.png`
- `river-tile.png`
- `hill-tile.png`
- `coal-pile.png`
- `coal-mine.png`
- `steam-puff.png`
- `joule-particle.png`

## Shop - objets par age

### Prehistoire

| Objet | Source | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Feu de camp | Biomasse | `campfire.png` | deja OK |

### Antiquite

| Objet | Source | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Foyer en pierre | Biomasse | `stone-hearth.png` | deja OK |
| Boeufs de traction | Elevage | `ox.png` | deja OK |

### Moyen Age

| Objet | Source | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Four a charbon de bois | Biomasse | `logs.png` | four a charbon de bois / meule charbonniere |
| Charrue lourde | Elevage | `plough.png` | deja OK |
| Moulin a eau | Eau et vent | `water-wheel.png` | deja OK |

### Age industriel

| Objet | Source | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Gazogene a bois | Biomasse | `boiler.png` | gazogene a bois compact |
| Relais de chevaux | Elevage | `horse.png` | relais / petite ecurie avec cheval |
| Pompe a vent | Eau et vent | `windmill.png` | pompe a vent / eolienne de pompage |
| Machine a vapeur | Fossile | `steam-engine.png` | deja OK |

### Age atomique

| Objet | Source | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Digesteur biogaz | Biomasse | `food-cache.png` | cuve de biogaz |
| Logistique alimentaire | Elevage | `granary.png` | entrepot alimentaire / convoyeur |
| Reseau hydro-eolien | Eau et vent | `windmill.png` | pylone + eau/vent connectes |
| Turbine thermique | Fossile | `small-factory.png` | turbine thermique / centrale thermique |
| Coeur de reacteur | Atome | `images-finales-gpt-image/atomic/island-atomic-05-built-reactor-core.png` | deja OK |

## Technologies par age

Les technologies ne sont pas des nouveaux batiments achetables. Elles font evoluer un objet existant.

### Prehistoire

| Technologie | Cible | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Conservation de la braise | Feu de camp | `fire-glow.png` | braise / feu couvert |

### Antiquite

| Technologie | Cible | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Foyer maconne | Foyer en pierre | `stone-hearth.png` | foyer en pierre plus structure |
| Domestication de traction | Boeufs de traction | `ox.png` | boeuf avec joug |

### Moyen Age

| Technologie | Cible | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Charbonnage | Four a charbon de bois | `logs.png` | charbonniere fumante |
| Collier d'epaule | Charrue lourde | `horse.png` | harnais / collier de traction |
| Moulin a vent | Moulin a eau | `windmill.png` | deja OK |

### Age industriel

| Technologie | Cible | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Gaz de bois | Gazogene a bois | `boiler.png` | gazogene avec tuyau |
| Haras logistiques | Relais de chevaux | `horse.png` | ecurie / relais |
| Pompes mecaniques | Pompe a vent | `windmill.png` | pompe mecanique |
| Vapeur haute pression | Machine a vapeur | `steam-engine.png` | machine vapeur amelioree |

### Age atomique

| Technologie | Cible | Asset actuel | Asset ideal |
| --- | --- | --- | --- |
| Methanisation | Digesteur biogaz | `food-cache.png` | cuve biogaz |
| Chaine alimentaire | Logistique alimentaire | `granary.png` | chaine logistique alimentaire |
| Eoliennes modernes | Reseau hydro-eolien | `windmill.png` | eolienne moderne |
| Cycle thermique | Turbine thermique | `small-factory.png` | turbine / alternateur |
| Fission controlee | Coeur de reacteur | `images-finales-gpt-image/atomic/island-atomic-05-upgraded-controlled-fission.png` | deja OK |

## UI - icones de l'interface

Ces icones peuvent rester en Lucide React, pas besoin de generer des PNG :

- Energie : `Zap`
- Production passive / chaleur : `Flame`
- Shop : `ShoppingBag`
- Technologie : `Microscope`
- Passage d'age : `ChevronsRight`
- Disponible : `Zap`
- Verrouille : `Lock`
- Termine / recherche : `Check`
- Biomasse : `Leaf`
- Elevage : `Beef`
- Eau et vent : `Wind`
- Fossile : `Factory`
- Atome : `Atom`

## Priorite de production assets

### Priorite 1

- Gazogene a bois.
- Four a charbon de bois.
- Cuve de biogaz.
- Eolienne moderne.

### Priorite 2

- Relais de chevaux / ecurie.
- Pompe a vent.
- Reseau hydro-eolien.
- Turbine thermique.
- Chaine logistique alimentaire.

### Priorite 3

- Variantes ameliorees des assets deja presents : foyer maconne, boeuf avec joug, charbonniere, machine vapeur haute pression.

## Journal

### 2026-06-18

- Ajout de cette liste d'icones/assets.
- Separation entre assets deja disponibles et assets a produire.
- Clarification : les icones UI peuvent rester en Lucide, les objets du jeu doivent idealement etre des PNG 3D minimalistes.

### 2026-06-18 - Iles volantes

- Ajout d'un document dedie : `docs/liste-iles-volantes-assets.md`.
- Clarification : ce fichier garde les assets de cartes UI, tandis que les iles volantes representent le monde central et les sources du mix energetique.

### 2026-06-19 - Pack final V1

- Le Coeur de reacteur et Fission controlee utilisent maintenant les images finales du pack `images-finales-gpt-image`.
- Les iles finalisees restent referencees dans `docs/liste-iles-volantes-assets.md`.
