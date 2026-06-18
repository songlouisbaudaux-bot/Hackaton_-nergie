# Rapport vision — Prometheus Protocol

> Document de référence pour commencer le développement.
>
> Important : ce document doit guider la V1 en suivant **la vision exprimée par le porteur du projet**. Les idées ajoutées peuvent aider, mais elles ne doivent pas prendre le dessus. On avance étape par étape : d'abord le cœur validé, puis on enrichira ensuite.

---

## 1. Idée centrale du jeu

**Prometheus Protocol** est un jeu incremental inspiré de *Universal Paperclips*, mais au lieu de produire des trombones, le joueur produit de l'énergie.

L'idée de base est simple :

> Tout est énergie.
>
> L'économie, le confort, la nourriture, le transport, l'industrie, les machines et la civilisation sont des formes d'énergie transformée.

Le jeu doit donc faire ressentir que l'énergie n'est pas juste un compteur abstrait. Le joueur doit comprendre que chaque action humaine, chaque ressource, chaque technologie et chaque époque correspond à une manière différente de capter, transformer ou utiliser de l'énergie.

Le joueur ne doit pas avoir l'impression de “miner de l'énergie” comme dans un jeu classique. Il doit plutôt avoir l'impression de faire évoluer un **système énergétique**.

---

## 2. Structure globale validée

Le jeu commence par une **cinématique IA déjà générée**, d'environ 15 secondes.

Après cette cinématique, le joueur arrive directement dans le gameplay.

La première scène jouable doit être très simple :

- une interface épurée ;
- un petit monde au centre ;
- un feu de camp ;
- une tente ;
- quelques humains ;
- une zone de chasse / forêt ;
- un compteur d'énergie.

Le joueur clique sur le monde central, surtout sur le feu de camp au début. Chaque clic produit de l'énergie.

Le jeu doit ensuite évoluer progressivement jusqu'au monde moderne, avec l'objectif d'arriver à **2026 en environ 10 minutes**.

---

## 3. Le point le plus important : le clic

Le jeu doit garder la simplicité de Paperclips : une action principale, très claire.

Dans Paperclips :

> je clique → je produis un trombone.

Ici :

> je clique → je produis de l'énergie.

Mais il faut bien comprendre que le clic ne veut pas dire littéralement “alimenter le feu”. Cette formulation ne convient pas à la vision actuelle.

Le clic représente plutôt :

> activer le système énergétique disponible à cette époque.

Au début, ce système est très primitif :

- le corps humain ;
- la nourriture ;
- la chasse ;
- le bois ;
- le feu.

Donc, au début, quand le joueur clique sur le feu de camp / le campement, cela symbolise l'activité humaine globale : les humains mangent, chassent, coupent ou ramassent du bois, entretiennent le foyer, survivent, et produisent une toute petite quantité d'énergie utile.

Il ne faut donc pas mettre un gros bouton texte du type :

```txt
Alimenter le feu
```

Le bouton doit être **l'objet graphique lui-même** : le feu de camp / le petit monde central.

Le gameplay doit être visuel :

```txt
je clique sur le campement → + quelques joules
```

---

## 4. Ressource principale : l'énergie

La ressource centrale du jeu est l'énergie.

Pour le début, on compte en **joules**.

C'est logique parce que :

- le joule est une unité générale d'énergie ;
- le watt ou le kWh parlent davantage au monde électrique moderne ;
- au début de l'histoire humaine, l'énergie est très faible et très concrète.

La valeur interne peut donc être stockée en joules :

```ts
energyJoules: number
```

Au tout début, le joueur doit voir des petits nombres :

```txt
+1 J
+2 J
+5 J
```

C'est important pour montrer que l'énergie disponible au début de l'humanité est minuscule comparée au monde moderne.

Plus tard, l'affichage pourra changer automatiquement :

```txt
J → Wh → kWh → MWh → GWh → TWh
```

Mais pour la première version, il faut surtout réussir le début en joules.

---

## 5. Le concept clé : le mix énergétique

C'est l'idée centrale validée pendant la discussion : le jeu ne doit pas avoir une seule source d'énergie abstraite.

Le jeu doit montrer un **mix énergétique**.

Au début, le mix est très simple :

```txt
Énergie humaine / nourriture
Bois / feu
```

Le joueur commence avec des humains qui mangent, chassent, utilisent leur corps, et un feu de camp qui transforme le bois en chaleur et en énergie utile.

Ensuite, au fur et à mesure de l'histoire, le mix s'enrichit :

```txt
Énergie humaine / nourriture
Bois / feu
Force animale
Eau / vent
Charbon / vapeur
Électricité
Pétrole / gaz
Fission
Solaire / éolien moderne
Stockage / réseau
```

L'important est que les anciennes sources ne disparaissent pas immédiatement. Elles restent visibles comme des couches historiques.

Le monde moderne n'est pas une énergie unique. C'est un empilement de sources, de technologies et d'infrastructures.

Le jeu doit faire ressentir ça visuellement.

---

## 6. Monde central et quartiers énergétiques

L'interface doit avoir un petit monde central qui évolue.

L'idée validée : chaque type d'énergie doit avoir son **quartier** ou sa **zone visuelle**.

Au début, le monde contient :

- un feu de camp ;
- une tente ;
- quelques humains ;
- une forêt / zone de chasse.

Ensuite, de nouveaux quartiers apparaissent autour du centre.

### Quartier feu / bois

Au début :

- feu de camp ;
- bois ;
- forêt ;
- petite fumée ;
- campement.

Ce quartier représente l'énergie du bois, de la chaleur, du foyer, de la survie.

### Quartier humain / nourriture

Au début :

- humains ;
- chasse ;
- nourriture ;
- tente ;
- petit camp.

Ce quartier représente l'énergie humaine : le corps, la nourriture, l'effort, la chasse.

### Quartier animal

Idée importante exprimée : on peut avoir une prairie vide au début, puis elle se remplit au fil du temps.

Évolution possible :

- prairie vide ;
- bœufs ;
- chevaux ;
- charrue ;
- transport local.

Cela permet de montrer que la force animale est une nouvelle source d'énergie avant les machines.

### Quartier eau / vent

Les moulins arrivent assez tôt.

Éléments visuels :

- rivière ;
- roue à eau ;
- colline ;
- moulin à vent.

Ce quartier montre les premières énergies renouvelables mécaniques.

### Quartier charbon / vapeur

Éléments visuels :

- mine ;
- charbon ;
- chaudière ;
- fumée ;
- machine à vapeur ;
- petite usine.

Ce quartier doit donner le premier gros saut de production.

### Quartier électricité

Éléments visuels :

- générateur ;
- câbles ;
- poteaux ;
- lignes électriques ;
- ampoules ;
- ville qui s'allume.

C'est un moment visuel important : l'énergie devient invisible, distribuée, connectée.

### Quartier pétrole / gaz

Éléments visuels :

- puits de pétrole ;
- raffinerie ;
- route ;
- camion ;
- port stylisé ;
- centrale gaz.

Ce quartier montre l'énergie de la mobilité et de la croissance rapide.

### Quartier fission

Éléments visuels :

- centrale nucléaire ;
- lumière froide ;
- symbole de contrôle ;
- infrastructure propre et stable visuellement.

Ce quartier doit être puissant, mais sérieux.

### Quartier renouvelables modernes

Éléments visuels :

- panneaux solaires ;
- éoliennes modernes ;
- météo ;
- réseau.

Ce quartier montre que produire propre ne suffit pas : il faut produire au bon moment.

### Quartier stockage / réseau 2026

Éléments visuels :

- batteries ;
- data center ;
- véhicules électriques ;
- réseau lumineux ;
- centre de pilotage.

Ce quartier correspond au passage vers 2026.

---

## 7. Style graphique validé : 3D minimaliste

Le style graphique recherché est :

> 3D minimaliste.

C'est un style proche des avatars 3D modernes, des emojis 3D, des petites icônes 3D propres, arrondies et lisibles.

Il faut viser un rendu :

- doux ;
- simple ;
- moderne ;
- propre ;
- pas réaliste ;
- pas trop détaillé ;
- un peu “jouet” ;
- lisible dans une interface de jeu ;
- cohérent entre tous les éléments.

Mots-clés utiles pour les assets :

```txt
3D minimaliste
soft 3D
emoji-like 3D
isometric 3D
low-poly propre
toy-like render
rounded shapes
soft shadows
clean game asset
```

Il faut éviter :

- le réalisme sombre ;
- le style documentaire ;
- le style PowerPoint écologique ;
- les images trop chargées ;
- les textures trop réalistes ;
- les assets qui ne se mélangent pas bien entre eux.

L'objectif est que le jeu ait l'air d'un petit monde vivant, clair et agréable.

---

## 8. Génération des assets graphiques

Comme le style est visuel, il faudra générer beaucoup d'assets.

Mais il faut les générer de manière cohérente, pas au hasard.

Tous les assets doivent respecter les mêmes règles :

- même angle de caméra ;
- même lumière ;
- même niveau de détail ;
- même échelle visuelle ;
- fond transparent si possible ;
- objet isolé et facile à intégrer ;
- silhouette lisible même en petit ;
- pas de texte dans l'image ;
- pas d'interface dans l'image ;
- style 3D minimaliste homogène.

### Prompt de style générique pour les assets

```txt
3D minimaliste, style emoji 3D moderne, formes douces et arrondies, rendu propre type jouet, couleurs lumineuses, ombres douces, vue isométrique légère, asset de jeu vidéo, objet isolé, fond transparent, silhouette lisible, pas de texte, pas de réalisme sombre, pas de décor complexe
```

À adapter selon l'objet.

Exemple :

```txt
Petit feu de camp stylisé, 3D minimaliste, style emoji 3D moderne, formes douces et arrondies, flammes simples orange et jaune, pierres autour du feu, rendu propre type jouet, couleurs lumineuses, ombres douces, vue isométrique légère, asset de jeu vidéo, objet isolé, fond transparent, silhouette lisible, pas de texte
```

---

## 9. Liste des premiers assets à générer

### Priorité 1 — première scène jouable

Ces assets sont nécessaires pour commencer le jeu :

- feu de camp ;
- tente primitive ;
- personnage humain simple ;
- arbre ;
- buisson / forêt simple ;
- bûches / bois ;
- viande / nourriture simple ;
- sol / tuile de terrain ;
- petit effet de lumière autour du feu ;
- particule ou petit `+J` visuel.

### Priorité 2 — premier mix énergétique

Ces assets servent à montrer que le début n'est pas seulement le feu, mais un mix entre humains, nourriture, chasse, bois et feu :

- chasseur stylisé ;
- petit animal de chasse très simple ;
- réserve de nourriture ;
- tas de bois ;
- foyer plus stable ;
- petit groupe humain autour du feu.

### Priorité 3 — progression ancienne

À générer ensuite :

- champ ;
- grenier ;
- prairie vide ;
- bœuf ;
- cheval ;
- charrue ;
- roue à eau ;
- moulin à vent ;
- rivière ;
- colline.

### Priorité 4 — monde industriel et moderne

À générer plus tard :

- mine de charbon ;
- machine à vapeur ;
- petite usine ;
- générateur ;
- pylône électrique ;
- câble électrique ;
- ville allumée ;
- puits de pétrole ;
- raffinerie ;
- camion ;
- centrale nucléaire ;
- panneau solaire ;
- éolienne moderne ;
- batterie ;
- data center ;
- véhicule électrique ;
- centre de pilotage réseau.

---

## 10. Animation : rester simple au début

Les animations ne doivent pas bloquer le développement.

On ne part pas sur une grosse animation complexe pour chaque asset.

Première approche : générer des assets statiques, puis les animer dans le jeu avec du CSS / JS / moteur front.

Animations simples suffisantes au début :

- feu qui pulse ;
- lumière qui respire ;
- petit `+1 J` qui flotte au clic ;
- micro secousse ou scale au clic ;
- fumée qui monte ;
- moulin qui tourne ;
- lignes électriques qui s'allument ;
- panneaux ou bâtiments qui apparaissent avec un fade/scale.

Le but est de donner de la vie sans construire une pipeline d'animation trop lourde.

---

## 11. Première version à développer

La première version ne doit pas essayer de tout faire.

Elle doit uniquement prouver que la vision fonctionne.

### Étape 1 — scène jouable de base

Objectif : après la cinématique, le joueur arrive sur le campement.

À faire :

- afficher un écran de jeu ;
- afficher le petit monde central ;
- afficher feu de camp + tente + humains ;
- rendre le feu de camp / monde central cliquable ;
- afficher l'énergie en joules ;
- à chaque clic, ajouter quelques joules ;
- afficher un petit `+X J` flottant ;
- donner une sensation agréable au clic.

Critère de réussite :

> Le joueur comprend immédiatement qu'il clique sur le campement pour produire de l'énergie.

### Étape 2 — premier mix énergétique

Objectif : montrer que l'énergie du début vient d'un mix.

À faire :

- afficher un panneau “Mix énergétique” ;
- afficher deux sources :
  - énergie humaine / nourriture ;
  - bois / feu ;
- montrer leur contribution à la production ;
- ajouter quelques améliorations simples.

Exemples d'améliorations possibles :

```txt
Chasse organisée
Stock de bois
Foyer stable
Groupe autour du feu
```

Attention : ce ne sont pas des choix narratifs lourds. Ce sont des améliorations incremental classiques.

### Étape 3 — progression visuelle

Objectif : commencer à faire apparaître les quartiers.

À faire :

- prairie vide ;
- animaux ;
- champ ;
- moulin ;
- première production passive visible.

Critère de réussite :

> Le joueur voit que le monde s'agrandit par sources d'énergie.

### Étape 4 — suite de l'histoire énergétique

Ensuite seulement, on ajoute :

- charbon ;
- vapeur ;
- électricité ;
- pétrole / gaz ;
- fission ;
- renouvelables ;
- stockage ;
- 2026.

---

## 12. Ce qu'il ne faut pas faire maintenant

Ne pas partir trop vite dans des systèmes complexes.

Pour l'instant, il ne faut pas prioriser :

- un vrai système politique complexe ;
- une simulation énergétique réaliste ;
- une carte du monde ;
- un système complet de marché ;
- un LLM ou HELIOS complet ;
- des dizaines de jauges ;
- des choix narratifs lourds dès le début ;
- une pipeline d'animation compliquée ;
- des assets réalistes ou incohérents entre eux.

Il ne faut pas non plus imposer au début un bouton texte du type :

```txt
Alimenter le feu
```

La vision validée est :

> le joueur clique sur l'objet graphique central, pas sur un gros bouton narratif.

---

## 13. Règle de développement

On développe dans cet ordre :

1. cinématique ou placeholder d'intro ;
2. campement 3D minimaliste ;
3. clic sur le feu / campement ;
4. compteur de joules ;
5. feedback visuel au clic ;
6. premier mix énergétique ;
7. premières améliorations ;
8. premiers quartiers ;
9. progression historique ;
10. équilibrage et polish.

À chaque étape, on valide si ça correspond à la vision avant d'ajouter autre chose.

---

## 14. Phrase de direction pour l'équipe

> On ne fait pas un simulateur complet de l'énergie.
>
> On fait un Paperclips de l'énergie, avec un petit monde en 3D minimaliste qui grandit par mix énergétique.
>
> Au début, le joueur clique sur un feu de camp / campement. Il gagne des joules. Puis il comprend que derrière chaque joule, il y a des humains, de la nourriture, du bois, des animaux, des machines, des réseaux, et finalement toute une civilisation.

---

## 15. Résumé ultra-court pour Codex

Créer une première version jouable de Prometheus Protocol : après une cinématique IA de 15 secondes, afficher un petit campement en style 3D minimaliste avec feu de camp, tente, humains et forêt. Le feu de camp / campement est l'objet cliquable principal. Chaque clic produit des joules. Le clic représente le système énergétique primitif : humains + nourriture/chasse + bois + feu. Ne pas créer un bouton texte “Alimenter le feu”. Afficher un compteur d'énergie en joules, un feedback `+X J`, puis un panneau de mix énergétique avec au départ “Énergie humaine / nourriture” et “Bois / feu”. Le monde doit ensuite évoluer par quartiers énergétiques : prairie/animaux, moulins, charbon/vapeur, électricité, pétrole/gaz, fission, renouvelables, stockage/2026. Utiliser des assets 3D minimalistes cohérents, style emoji 3D moderne, objets isolés, lumineux, arrondis, faciles à intégrer et à animer simplement dans le jeu.
