# Ouverture et cinematique

## Objectif

Le debut doit claquer.

Un joueur de hackathon decide en 15 secondes s'il reste. Le jeu doit donc commencer par une experience, pas par un menu.

## Structure

Duree cible : 35 a 60 secondes.

La cinematique doit etre interactive, pas une video. Elle sert de tutoriel cache.

### Sequence 1 - Noir

Ecran presque noir. Bruit visuel tres leger. Interface absente.

Texte :

> Avant le feu, la nuit decide pour nous.

Un seul bouton :

> Frotter deux pierres

Au premier clic, rien d'enorme : une etincelle. Le compteur affiche `+1 J`.

### Sequence 2 - Etincelle

Le joueur clique encore. Les etincelles s'accumulent. Un cercle de lumiere tremble au centre.

Textes courts possibles :

- "La chaleur garde les mains ouvertes."
- "La nuit recule d'un pas."
- "Une tribu peut attendre le matin."

Le compteur passe de J a Wh quand le feu tient.

### Sequence 3 - Feu

Le bouton devient :

> Entretenir le feu

Premiere ressource permanente :

- Energie stockee
- Chaleur
- Soutien social

Le soutien social monte parce que le feu rassemble.

Message :

> L'energie n'est pas encore une industrie. C'est une promesse de demain.

### Sequence 4 - Premier choix

Le jeu pose son premier vrai dilemme :

- Bruler plus de bois : energie rapide, foret qui baisse.
- Organiser la collecte : plus lent, soutien social plus haut.

Ce choix doit annoncer toute la philosophie du jeu.

### Sequence 5 - Deploiement de l'interface

L'interface complete n'apparait pas d'un coup. Elle se revele par couches :

1. compteur energie ;
2. soutien social ;
3. ressources ;
4. technologies ;
5. marche ;
6. climat ;
7. rival IA.

Cette apparition progressive donne un effet Paperclips : le monde commence petit puis devient trop grand.

## Direction visuelle

Le jeu doit s'eclairer avec la progression.

- Age de pierre : noir, ambre, feu, texture organique.
- Bois/agriculture : brun, ambre, interface encore organique.
- Eau/vent : bleus doux, roues, premiere production passive.
- Charbon/industrie : acier, fumee, cadrans, chiffres plus nombreux.
- Electricite : blanc, bleu, reseau, lignes fines.
- Fission : lumiere froide, precision, danger contenu.
- Renouvelables : ciel clair, vert discret, grille stable.
- Fusion : blanc chaud, plasma, densite d'information.
- Orbital : or, noir spatial, soleil, echelle cosmique.

Important : eviter le rendu "PowerPoint ecologie". Il faut un objet de jeu, pas un site educatif.

## Son et feedback

Meme sans vraie bande-son, il faut prevoir des feedbacks :

- clic pierre : son sec ;
- etincelle : micro flash ;
- feu stable : souffle chaud ;
- palier debloque : pulse lumineux ;
- soutien social critique : interface qui tremble legerement ;
- prix negatif : compteur marche qui bascule visuellement ;
- rival IA en avance : notification froide et precise.

Si le temps manque, on peut faire les sons plus tard et garder les animations CSS.

## Premiere minute ideale

0s : noir.

3s : phrase d'ouverture.

6s : premier clic.

10s : etincelle visible.

20s : feu stable, compteur Wh.

35s : premier choix de gameplay.

50s : premiere technologie.

60s : le joueur comprend qu'il est en train de faire grandir l'humanite par l'energie.

## Texte d'ouverture recommande

Version courte :

> Avant le feu, la nuit decide pour nous.

Puis :

> Chaque watt repousse une limite.

Puis :

> Chaque limite repoussee en cree une autre.

Puis :

> Produis. Partage. Survis a ta puissance.
