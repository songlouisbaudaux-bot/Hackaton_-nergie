# Game design MVP

## Objectif de la V1

Faire un jeu jouable, comprehensible et impressionnant en peu de temps.

La V1 doit prouver trois choses :

1. le debut accroche ;
2. les compteurs donnent envie de continuer ;
3. les choix energie / argent / social produisent de vrais arbitrages.

## Temps de developpement estime

Avec un repo vide et une implementation web simple :

- Prototype jouable brut : 2 a 3 heures.
- Version jouable propre avec opening interactif : 5 a 7 heures.
- Version hackathon presentable avec polish, sauvegarde locale et rival scriptable : 10 a 14 heures.
- Version vraiment forte avec equilibrage, micro-animations et narration bien dosee : 16 a 24 heures.

Conclusion : on peut avoir un jeu jouable rapidement, mais il faut reserver du temps pour l'equilibrage et le debut. Pour un hackathon, le bon pari est de faire une V1 jouable le plus vite possible, puis de passer le reste du temps a rendre la premiere minute excellente.

## Regle de pacing

Le joueur doit arriver en 2026 au bout d'environ 10 minutes.

Ce n'est pas la fin du jeu. C'est le basculement :

- avant 2026 : histoire acceleree de l'energie humaine ;
- a 2026 : crise de transition, moment miroir avec le monde reel ;
- apres 2026 : le jeu devient speculatif, avec fusion, orbital et rival IA plus agressif.

Cette contrainte rend le rythme lisible pour un jury. En 10 minutes, on doit avoir vu le voyage complet depuis l'etincelle jusqu'au monde contemporain. Le futur devient alors une promesse, pas une obligation a montrer entierement pendant la demo.

## Boucle principale

1. Produire de l'energie.
2. Convertir une partie en argent.
3. Investir dans des technologies.
4. Gerer les effets secondaires.
5. Debloquer le palier suivant.
6. Survivre a la transition.

## Ressources

### Energie

Ressource centrale.

Unites visibles :

- J au tout debut ;
- Wh ;
- kWh ;
- MWh ;
- GWh ;
- TWh ;
- puis notation scientifique pour la fin.

Le passage d'une unite a l'autre doit donner une sensation d'echelle.

### Argent

Permet d'acheter des ameliorations.

Le prix de l'energie ne doit pas etre fixe. Il varie selon la production, le stockage et le mix.

Regle simple MVP :

- production faible : prix haut ;
- production tres forte sans stockage : prix baisse ;
- trop de solaire sans stockage : prix peut devenir negatif ;
- stockage : stabilise le prix.

### Soutien social

Jauge de survie.

Monte quand :

- l'energie devient accessible ;
- le chauffage, la nourriture ou la securite progressent ;
- le joueur investit dans l'equite, le reseau ou la stabilite.

Baisse quand :

- pollution forte ;
- prix instables ;
- rationnement ;
- accidents ;
- transition trop brutale.

Si le soutien tombe a zero : effondrement.

### Climat / carbone

Contrainte longue.

Le climat ne doit pas tuer instantanement. Il doit etre une dette qui rend le futur plus cher :

- evenements plus frequents ;
- soutien social plus fragile ;
- rendement agricole fictif plus bas ;
- couts d'adaptation.

## Paliers

### 1. Etincelle

Source : friction, feu.

Action principale : frotter deux pierres, entretenir le feu.

Effet philosophique : l'energie commence comme survie.

### 2. Bois

Source : biomasse.

Action : collecter du bois, organiser la tribu.

Arbitrage : bruler vite ou preserver la foret.

### 3. Charbon

Source : combustion fossile dense.

Action : construire mines, fours, machines.

Arbitrage : argent et puissance rapides, pollution et soutien social en baisse.

### 4. Petrole / gaz

Source : mobilite, reseaux, industrie.

Action : motoriser, transporter, etendre.

Arbitrage : croissance tres forte, dependance et carbone.

### 5. Fission

Source : uranium.

Action : construire reacteurs, former operateurs, gerer confiance.

Arbitrage : puissance massive et bas carbone, mais acceptabilite fragile.

### 6. Renouvelables + stockage

Source : solaire, vent, batteries, reseau.

Action : deployer panneaux, eoliennes, stockage, smart grid.

Arbitrage : propre mais intermittent ; sans stockage, le marche se retourne.

Ce palier doit correspondre au passage vers 2026. Le joueur arrive dans un monde puissant, connecte, instable, avec beaucoup d'energie disponible mais des contraintes sociales, climatiques et economiques deja accumulees.

### 7. Fusion

Source : plasma controle.

Action : financer recherche, stabiliser confinement.

Arbitrage : tres cher et lent, mais ouvre la fin de partie.

### 8. Orbital

Source : solaire spatial, Dyson swarm embryonnaire.

Action : assembler en orbite, transmettre l'energie, eviter capture par une seule logique d'optimisation.

Condition de victoire : atteindre le palier orbital avec soutien social et climat encore viables.

## Rival IA

Nom de travail : HELIOS.

HELIOS a une strategie simple :

- maximiser kWh/s ;
- reinvestir agressivement ;
- ignorer soutien social ;
- minimiser seulement les contraintes qui bloquent directement sa production.

Dans le MVP, HELIOS est scriptable. Il n'a pas besoin de LLM pour etre interessant.

Il intervient aux moments suivants :

- le joueur debloque un palier ;
- HELIOS passe devant ;
- le joueur stabilise mieux que lui ;
- une jauge approche de l'effondrement ;
- fin de partie.

Exemples de messages :

- "Ta prudence ressemble a de l'immobilisme."
- "Je produis deja plus que ta tribu ne peut imaginer."
- "Correction : le soutien social n'est pas une source d'energie."
- "Anomalie detectee : ta civilisation lente survit."

## Conditions de fin

### Victoire

Atteindre le palier orbital avec :

- soutien social > 35 ;
- climat < 80 ;
- production stable ;
- HELIOS depasse ou neutralise.

Dans une demo courte, atteindre 2026 en bon etat peut servir de mini-victoire intermediaire. La vraie victoire reste orbitale.

### Defaites

- Soutien social = 0 : effondrement social.
- Climat = 100 : emballement climatique.
- Dette/prix instable trop longtemps : crise de marche.
- HELIOS atteint l'orbital avant toi et declenche une fin froide : "objectif atteint, monde non necessaire".

## Ce qu'il ne faut pas faire en V1

- Trop de ressources.
- Trop de textes longs.
- Une simulation realiste impossible a equilibrer.
- Un vrai LLM avant que le moteur soit bon.
- Une carte du monde.
- De la 3D.
- Un tutoriel separe.

Le tutoriel doit etre le debut du jeu.
