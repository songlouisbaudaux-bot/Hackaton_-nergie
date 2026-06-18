# Planning hackathon

## Reponse courte

Oui, c'est jouable.

Le jeu peut etre jouable en quelques heures si on accepte une premiere version simple. Pour qu'il claque vraiment au debut, il faut investir le polish sur la premiere minute avant d'ajouter des fonctionnalites secondaires.

## Strategie recommandee

Priorite absolue :

1. opening interactif ;
2. boucle incremental ;
3. progression age de pierre -> energie moderne ;
4. jauges contradictoires ;
5. rival IA scriptable ;
6. polish visuel et equilibrage.

Le debut doit etre meilleur que le milieu. En hackathon, beaucoup de gens verront surtout la premiere minute.

## Plan de production

### Phase 1 - Socle jouable

Duree cible : 2 a 3 heures.

Livrables :

- app web locale ;
- compteur energie ;
- boucle temps reel ;
- boutons d'achat ;
- premiers paliers ;
- sauvegarde locale basique si rapide.

Objectif : avoir un jeu qui tourne, meme laid.

### Phase 2 - Debut qui claque

Duree cible : 2 a 4 heures.

Livrables :

- ecran noir initial ;
- bouton "Frotter deux pierres" ;
- apparition progressive du feu ;
- compteur qui nait sous les yeux du joueur ;
- transition vers l'interface de jeu ;
- micro-textes philosophiques.

Objectif : une premiere minute memorable.

### Phase 3 - Tension de jeu

Duree cible : 3 a 5 heures.

Livrables :

- soutien social ;
- argent ;
- climat/carbone ;
- effets differents par technologie ;
- marche avec prix variable ;
- premieres conditions de defaite.

Objectif : le joueur doit arbitrer, pas seulement cliquer.

### Phase 4 - Rival IA

Duree cible : 2 a 4 heures.

Livrables :

- progression concurrente ;
- messages contextuels ;
- comparaison de production ;
- possibilite d'etre depasse ;
- fin alternative si HELIOS gagne.

Objectif : donner une presence et une tension narrative.

### Phase 5 - Polish et equilibrage

Duree cible : 4 a 8 heures.

Livrables :

- valeurs ajustees ;
- animations ;
- transitions par age ;
- feedbacks visuels ;
- textes plus courts ;
- README propre ;
- capture/demo stable.

Objectif : rendre le jeu presentable et addictif.

## Decision importante

Il faut coder le moteur en config.

Les technologies, couts, multiplicateurs, impacts sociaux et impacts carbone doivent etre dans un fichier facile a modifier. Sinon l'equilibrage prendra trop de temps.

Structure recommandee :

- `technologies`: source, cout, production, carbone, social, preconditions ;
- `events`: seuil, message, effet ;
- `rival`: rythme, priorites, phrases ;
- `eras`: couleur, titre, texte, seuil.

## MVP final vise

Le joueur doit arriver en 2026 en environ 10 minutes.

Une partie complete peut durer 15 a 20 minutes si le futur est inclus. Pour le hackathon, le rythme prioritaire est :

- 0 a 1 minute : age de pierre, feu, naissance du compteur ;
- 1:00 a 2:05 : bois, tribu, premiers choix sociaux ;
- 2:05 a 3:10 : agriculture, grenier, force animale ;
- 3:10 a 4:05 : eau, vent, premiers moteurs naturels ;
- 4:05 a 5:20 : charbon, vapeur, industrie, puissance rapide ;
- 5:20 a 6:20 : electricite, lumiere, reseau ;
- 6:20 a 7:15 : petrole/gaz, mobilite, marche, carbone ;
- 7:15 a 8:05 : fission, confiance, acceptabilite sociale ;
- 8:05 a 9:15 : solaire, eolien, meteo, intermittence ;
- 9:15 a 10:00 : stockage, pilotage, arrivee en 2026 ;
- apres 10 minutes : fusion, orbital, rival IA et vraie fin.

La demo hackathon peut montrer :

1. ouverture age de pierre ;
2. feu qui devient groupe ;
3. agriculture puis moulins pour eviter le saut direct vers l'usine ;
4. acceleration charbon/electricite/petrole ;
5. apparition du probleme social/climat ;
6. arrivee en 2026 avec un monde puissant mais instable ;
7. choix entre vitesse et stabilite ;
8. tease du futur : fusion/orbital/HELIOS.

Pas besoin que le jury voie toute la fin. Il faut qu'il sente que le passage a 2026 est seulement le debut du vrai dilemme.

## Axe de presentation

Phrase de pitch :

> Prometheus Protocol est un Universal Paperclips de l'energie : tu pars d'une etincelle a l'age de pierre et tu essaies d'atteindre l'orbite sans que ta civilisation s'effondre sous sa propre puissance.

Phrase philosophique :

> Le jeu ne demande pas combien d'energie une civilisation peut produire. Il demande combien de puissance elle peut supporter.
