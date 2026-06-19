# Iles volantes - variations a generer

Ce document definit les iles volantes du monde central de Prometheus Protocol.
Il doit servir de brief propre pour la generation des images.

Principe retenu : on ne genere pas une ile differente a chaque fois.
On part d'une meme ile vierge, puis on genere des variations controlees par age, source d'energie, achat et technologie.

## Regle principale

- Une ile centrale represente le village.
- Une ile secondaire represente chaque type d'energie du mix.
- Une ile d'energie est invisible tant que son age n'est pas debloque.
- Quand l'age arrive, l'ile apparait avec une variante vierge ou tres simple.
- Quand le joueur achete un objet, le batiment de base apparait sur l'ile.
- Quand le joueur recherche la technologie correspondante, le meme batiment evolue visuellement.
- Les technologies doivent donc toujours correspondre a un batiment existant.
- Les achats repetables ne doivent pas empiler 50 batiments visibles. Ils peuvent ajouter de petits details a partir de seuils, mais l'ile reste claire.

Exemple :

```text
Age Moyen Age debloque -> ile eau/vent apparait
Objet achete -> Moulin a eau visible
Technologie recherchee -> le moulin evolue vers Moulin a vent
Age moderne -> la meme ile peut evoluer vers barrage + eoliennes modernes
```

## Base unique d'ile vierge

Toutes les iles doivent etre des variations de la meme base.

Fichier de reference a utiliser :

- temporaire : `public/assets/game/floating-grass-block-natural.png`
- ideal a generer : `island-base-blank.png`

Fichiers de base recommandes :

| Fichier | Usage | Priorite |
| --- | --- | --- |
| `island-base-blank.png` | Ile vierge naturelle, base de toutes les variations | haute |
| `island-base-forest.png` | Meme ile, teinte foret pour biomasse | moyenne |
| `island-base-pasture.png` | Meme ile, teinte prairie/champ pour elevage | moyenne |
| `island-base-river-hill.png` | Meme ile, ruisseau + relief pour eau/vent | moyenne |
| `island-base-rock.png` | Meme ile, roche sombre pour fossile | moyenne |
| `island-base-tech-platform.png` | Meme ile, plateforme propre pour atome | moyenne |

Important : les bases doivent garder la meme silhouette generale pour que le monde semble coherent.

## Style de generation

- Style : 3D minimaliste, toy-like, legerement isometrique.
- Format : PNG transparent.
- Pas de texte, pas de logo, pas d'UI, pas de watermark.
- Cadrage : ile entiere visible, ombre douce sous l'ile.
- Camera : meme angle pour toutes les variations.
- Densite : un batiment principal, 2 a 5 petits details maximum.
- Lisibilite : silhouette reconnaissable en petit.
- Palette : couleurs naturelles au debut, plus techniques ensuite, sans devenir monochrome.
- Nom de fichier : ASCII, kebab-case, importable facilement.

## Deverrouillage des iles par age

| Age debloque | Iles visibles apres deverrouillage | Nouvelle ile ajoutee |
| --- | --- | --- |
| Prehistoire | Centre + Biomasse | Biomasse |
| Antiquite | Centre + Biomasse + Elevage | Elevage / force animale |
| Moyen Age | Centre + Biomasse + Elevage + Eau/Vent | Eau et vent |
| Age industriel | Centre + Biomasse + Elevage + Eau/Vent + Fossile | Fossile |
| Age atomique / 2026 | Toutes les iles | Atome |

Regle : une ile non debloquee n'est pas rendue. On evite les placeholders verrouilles au centre pour garder l'interface propre.

## Etats visuels d'une ile

Chaque ile peut avoir ces etats :

| Etat | Condition gameplay | Rendu |
| --- | --- | --- |
| `hidden` | Age pas encore debloque | Ile absente |
| `empty` | Age debloque, aucun objet de cette source achete | Base vierge source |
| `built` | Objet achete au moins une fois | Batiment de base visible |
| `upgraded` | Technologie correspondante recherchee | Batiment evolue |
| `dense` | Beaucoup d'exemplaires achetes | Quelques details en plus, pas un empilement |

La version `dense` est optionnelle. Elle pourra etre generee plus tard si on veut que les quantites aient un effet visuel sans surcharger.

## Integration actuelle

La couche d'integration est dans `src/game/islands.ts`.

- Les iles visibles sont choisies par age, objet achete et technologie recherchee.
- Les images utilisees en jeu viennent du pack final `public/assets/game/images-finales-gpt-image/`.
- Le pack final est range par famille : `central`, `base`, `biomass`, `animal`, `water-wind`, `fossil`, `atomic`.
- Les images en cours de creation peuvent rester dans `public/assets/game/islands-gpt-image-2/`.
- Une image GPT ne remplace une image draft que si elle est vraiment transparente et sans fond parasite.
- Si une image manque, le rendu la masque au lieu d'afficher une image cassee.

## Nomenclature

Format recommande :

```text
island-{source}-{ageIndex}-{state}-{slug}.png
```

Exemples :

- `island-biomass-01-built-campfire.png`
- `island-biomass-01-upgraded-ember-keeping.png`
- `island-water-wind-03-built-watermill.png`
- `island-water-wind-03-upgraded-windmill.png`
- `island-fossil-04-built-steam-engine.png`
- `island-fossil-04-upgraded-high-pressure-steam.png`

## Ile centrale - village

L'ile centrale evolue avec l'age atteint, pas avec une source d'energie precise.

| Age | Fichier | Variante | Contenu |
| --- | --- | --- | --- |
| Prehistoire | `island-central-01-camp.png` | campement | Feu, tente, quelques arbres, sol naturel |
| Antiquite | `island-central-02-village.png` | village | Petites maisons, champ discret, chemin de terre |
| Moyen Age | `island-central-03-medieval-town.png` | bourg | Maisons compactes, route pavee, place centrale |
| Age industriel | `island-central-04-industrial-town.png` | ville industrielle | Ateliers, rails courts, petites cheminees |
| Age atomique / 2026 | `island-central-05-modern-grid-city.png` | ville moderne | Batiments propres, reseau electrique, poste de controle |

## Correspondance iles, objets et technologies

Cette table est la reference principale : chaque technologie doit faire evoluer le batiment achete qui lui correspond.

### Biomasse

Ile debloquee des la Prehistoire.

| Age | Objet achetable | Technologie | Image objet | Image apres technologie |
| --- | --- | --- | --- | --- |
| Prehistoire | Feu de camp | Conservation de la braise | `island-biomass-01-built-campfire.png` | `island-biomass-01-upgraded-ember-keeping.png` |
| Antiquite | Foyer en pierre | Foyer maconne | `island-biomass-02-built-stone-hearth.png` | `island-biomass-02-upgraded-masonry-hearth.png` |
| Moyen Age | Four a charbon de bois | Charbonnage | `island-biomass-03-built-charcoal-kiln.png` | `island-biomass-03-upgraded-charcoal-craft.png` |
| Age industriel | Gazogene a bois | Gaz de bois | `island-biomass-04-built-wood-gasifier.png` | `island-biomass-04-upgraded-wood-gas-process.png` |
| Age atomique / 2026 | Digesteur biogaz | Methanisation | `island-biomass-05-built-biogas-digester.png` | `island-biomass-05-upgraded-methanization.png` |

Evolution visuelle : feu simple -> foyer stable -> charbon de bois -> gazogene -> biogaz.

### Elevage / force animale

Ile debloquee au Antiquite.

| Age | Objet achetable | Technologie | Image objet | Image apres technologie |
| --- | --- | --- | --- | --- |
| Antiquite | Boeufs de traction | Domestication de traction | `island-animal-02-built-oxen-pasture.png` | `island-animal-02-upgraded-animal-domestication.png` |
| Moyen Age | Charrue lourde | Collier d'epaule | `island-animal-03-built-heavy-plough.png` | `island-animal-03-upgraded-shoulder-collar.png` |
| Age industriel | Relais de chevaux | Haras logistiques | `island-animal-04-built-horse-relay.png` | `island-animal-04-upgraded-horse-logistics.png` |
| Age atomique / 2026 | Logistique alimentaire | Chaine alimentaire | `island-animal-05-built-food-logistics.png` | `island-animal-05-upgraded-food-chain.png` |

Evolution visuelle : boeufs -> charrue -> relais de chevaux -> logistique alimentaire moderne.

### Eau et vent

Ile debloquee au Moyen Age.

| Age | Objet achetable | Technologie | Image objet | Image apres technologie |
| --- | --- | --- | --- | --- |
| Moyen Age | Moulin a eau | Moulin a vent | `island-water-wind-03-built-watermill.png` | `island-water-wind-03-upgraded-windmill.png` |
| Age industriel | Pompe a vent | Pompes mecaniques | `island-water-wind-04-built-wind-pump.png` | `island-water-wind-04-upgraded-mechanical-pumps.png` |
| Age atomique / 2026 | Reseau hydro-eolien | Eoliennes modernes | `island-water-wind-05-built-hydro-wind-grid.png` | `island-water-wind-05-upgraded-modern-wind-turbines.png` |

Evolution visuelle : moulin a eau -> moulin a vent -> pompe mecanique -> barrage/reseau -> eoliennes modernes.

Note : le barrage n'est pas encore une technologie separee dans le gameplay actuel. Il peut apparaitre dans la variante `hydro-wind-grid`.

### Fossile

Ile debloquee a l'Age industriel.

| Age | Objet achetable | Technologie | Image objet | Image apres technologie |
| --- | --- | --- | --- | --- |
| Age industriel | Machine a vapeur | Vapeur haute pression | `island-fossil-04-built-steam-engine.png` | `island-fossil-04-upgraded-high-pressure-steam.png` |
| Age atomique / 2026 | Turbine thermique | Cycle thermique | `island-fossil-05-built-thermal-turbine.png` | `island-fossil-05-upgraded-thermal-cycle.png` |

Evolution visuelle : charbon/vapeur -> centrale thermique -> petrole/gaz si ajoutes plus tard.

Objets fossiles futurs possibles :

| Objet futur | Technologie future | Image objet | Image apres technologie |
| --- | --- | --- | --- |
| Mine de charbon | Extraction mecanisee | `island-fossil-03-built-coal-mine.png` | `island-fossil-03-upgraded-mechanized-coal.png` |
| Raffinerie de petrole | Craquage petrolier | `island-fossil-05-built-oil-refinery.png` | `island-fossil-05-upgraded-oil-cracking.png` |
| Turbine a gaz | Cycle combine | `island-fossil-06-built-gas-turbine.png` | `island-fossil-06-upgraded-combined-cycle.png` |

### Atome

Ile debloquee a l'Age atomique / 2026.

| Age | Objet achetable | Technologie | Image objet | Image apres technologie |
| --- | --- | --- | --- | --- |
| Age atomique / 2026 | Coeur de reacteur | Fission controlee | `island-atomic-05-built-reactor-core.png` | `island-atomic-05-upgraded-controlled-fission.png` |

Evolution visuelle pour le coeur 10 minutes : laboratoire/reacteur compact -> centrale fission propre.

Objets atomiques futurs possibles :

| Objet futur | Technologie future | Image objet | Image apres technologie |
| --- | --- | --- | --- |
| Reacteur moderne | Surete passive | `island-atomic-06-built-modern-fission.png` | `island-atomic-06-upgraded-passive-safety.png` |
| Tokamak | Fusion controlee | `island-atomic-07-built-fusion-plant.png` | `island-atomic-07-upgraded-controlled-fusion.png` |
| Centrale antimatiere | Confinement antimatiere | `island-atomic-08-built-antimatter.png` | `island-atomic-08-upgraded-antimatter-containment.png` |

Fusion, antimatiere et sphere de Dyson restent hors V1/V2 courte. Ce sont des variantes prestige.

## Regles pour les achats multiples

Les objets restent achetables plusieurs fois, mais le rendu doit rester propre.

Regle recommandee :

| Nombre achete | Effet visuel possible |
| --- | --- |
| 0 | Ile vide ou invisible selon l'age |
| 1 | Batiment principal visible |
| 2 a 4 | Quelques details : caisses, reserve, petit chemin |
| 5 a 9 | Un detail secondaire, pas un deuxieme gros batiment |
| 10+ | Variante dense optionnelle, toujours lisible |

Ne jamais afficher une copie exacte du batiment pour chaque achat. Le compteur `xN` reste dans l'interface.

## Prompt commun de generation

Base commune a donner pour chaque variation :

```text
Soft 3D toy-like floating island variation, same silhouette as the blank floating island reference, slight isometric camera, transparent background, no text, no UI, no watermark, one clear main energy building, a few small contextual details, rounded shapes, readable at small size, coherent with a minimalist strategy game.
```

Ajouter ensuite le contenu specifique :

```text
Biomass island, medieval charcoal kiln variation, small charcoal mound, stacked wood, soft smoke, forest ground details, warm natural palette.
```

## Assets deja presents utiles

Ces assets peuvent servir de reference ou de placeholder :

- `floating-grass-block-natural.png`
- `tile-energy-platform-buildable.png`
- `campfire.png`
- `stone-hearth.png`
- `ox.png`
- `plough.png`
- `water-wheel.png`
- `windmill.png`
- `coal-mine.png`
- `boiler.png`
- `steam-engine.png`
- `small-factory.png`
- `Panneaux_solaires.png`
- `Héoliennes.png`
- `Centrale_fission.png`
- `Centrale_fusion.png`
- `Centrale_antimatière.png`
- `Dyson_sphere.png`

Attention : les fichiers existants avec accents peuvent rester, mais les nouveaux fichiers doivent utiliser des noms ASCII.

## Priorite de generation

### Priorite 1 - base + jusqu'au Moyen Age

- `island-base-blank.png`
- `island-central-01-camp.png`
- `island-central-02-village.png`
- `island-central-03-medieval-town.png`
- `island-biomass-01-built-campfire.png`
- `island-biomass-01-upgraded-ember-keeping.png`
- `island-biomass-02-built-stone-hearth.png`
- `island-biomass-02-upgraded-masonry-hearth.png`
- `island-biomass-03-built-charcoal-kiln.png`
- `island-biomass-03-upgraded-charcoal-craft.png`
- `island-animal-02-built-oxen-pasture.png`
- `island-animal-02-upgraded-animal-domestication.png`
- `island-animal-03-built-heavy-plough.png`
- `island-animal-03-upgraded-shoulder-collar.png`
- `island-water-wind-03-built-watermill.png`
- `island-water-wind-03-upgraded-windmill.png`

### Priorite 2 - industriel + 2026

- `island-central-04-industrial-town.png`
- `island-central-05-modern-grid-city.png`
- `island-biomass-04-built-wood-gasifier.png`
- `island-biomass-04-upgraded-wood-gas-process.png`
- `island-biomass-05-built-biogas-digester.png`
- `island-biomass-05-upgraded-methanization.png`
- `island-animal-04-built-horse-relay.png`
- `island-animal-04-upgraded-horse-logistics.png`
- `island-animal-05-built-food-logistics.png`
- `island-animal-05-upgraded-food-chain.png`
- `island-water-wind-04-built-wind-pump.png`
- `island-water-wind-04-upgraded-mechanical-pumps.png`
- `island-water-wind-05-built-hydro-wind-grid.png`
- `island-water-wind-05-upgraded-modern-wind-turbines.png`
- `island-fossil-04-built-steam-engine.png`
- `island-fossil-04-upgraded-high-pressure-steam.png`
- `island-fossil-05-built-thermal-turbine.png`
- `island-fossil-05-upgraded-thermal-cycle.png`
- `island-atomic-05-built-reactor-core.png`
- `island-atomic-05-upgraded-controlled-fission.png`

### Priorite 3 - futur / prestige

- `island-fossil-03-built-coal-mine.png`
- `island-fossil-03-upgraded-mechanized-coal.png`
- `island-fossil-05-built-oil-refinery.png`
- `island-fossil-05-upgraded-oil-cracking.png`
- `island-fossil-06-built-gas-turbine.png`
- `island-fossil-06-upgraded-combined-cycle.png`
- `island-atomic-06-built-modern-fission.png`
- `island-atomic-06-upgraded-passive-safety.png`
- `island-atomic-07-built-fusion-plant.png`
- `island-atomic-07-upgraded-controlled-fusion.png`
- `island-atomic-08-built-antimatter.png`
- `island-atomic-08-upgraded-antimatter-containment.png`

## Checklist de validation

- Toutes les variations semblent venir de la meme ile vierge.
- Une ile non debloquee par l'age n'apparait pas.
- Chaque technologie correspond a un objet achete.
- Une technologie fait evoluer le batiment, elle ne cree pas une deuxieme ile.
- Les achats multiples ne surchargent pas le rendu.
- Le mix energetique reste lisible : une ile par type d'energie.
- Les images n'ont pas de texte.
- Les noms de fichiers sont ASCII et importables.

## Journal

### 2026-06-18

- Creation de la liste des iles volantes.
- Organisation par ile centrale, sources d'energie, ages, objets et technologies.
- Clarification : chaque ile d'energie se debloque avec son age.
- Clarification : les iles sont des variations de la meme ile vierge.
- Clarification : les technologies doivent correspondre a un objet achete et faire evoluer son rendu.

### 2026-06-18 - Integration V1

- Ajout de la couche `src/game/islands.ts`.
- Les iles draft sont rendues dans le monde central sans texte visible.
- Les assets GPT en cours sont reserves aux remplacements futurs quand ils sont propres.

### 2026-06-18 - Taille et remplacement

- Toutes les iles rendues par l'interface utilisent maintenant la meme taille CSS.
- Les images GPT avec fond parasite doivent rester dans `public/assets/game/islands-gpt-image-2/raw/failed/`.
- Le jeu continue d'utiliser les images draft propres tant qu'une image finale transparente n'est pas disponible.
