# Deroule production - 10 minutes

Ce document transforme le script narratif en plan de production.

But : permettre a quelqu'un de coder ou presenter les 10 premieres minutes sans relire tout le script long.

## Regle d'or

Chaque tranche doit suivre la meme structure :

1. Le joueur resout un probleme concret.
2. La solution augmente la puissance.
3. La solution cree un nouveau probleme.
4. Le probleme suivant justifie le prochain palier.

Si une tranche ne cree pas le besoin de la suivante, elle donne l'impression de sauter l'histoire.

## Tableau minute par minute

| Temps | Palier | Action joueur | Effet visuel | UI debloquee | Phrase cle | Probleme cree |
| --- | --- | --- | --- | --- | --- | --- |
| 0:00-0:20 | Nuit | Frotter deux pierres | Noir, etincelle, micro flash | Aucun panneau, seulement +1 J | Avant le feu, la nuit decide pour nous. | La braise ne tient pas. |
| 0:20-1:00 | Feu | Proteger puis entretenir le feu | Cercle de lumiere qui gagne sur le noir | Energie, chaleur | Autour du feu, demain existe. | Le feu demande du bois et des gens. |
| 1:00-2:05 | Bois / tribu | Bruler vite ou organiser la collecte | Camp, silhouettes, foret qui recule | Bois, soutien social | Une flamme chauffe plus qu'un corps. Elle dessine un groupe. | La faim revient, la chasse est aleatoire. |
| 2:05-3:10 | Agriculture / animaux | Semer, construire un grenier, domestiquer | Saisons accelerees, champ, animal de trait | Nourriture, population, temps disponible | Un champ, c'est de la lumiere mise en reserve. | Les muscles restent lents et fatigables. |
| 3:10-4:05 | Eau / vent | Construire moulin, relier au village | Riviere, colline, roue qui tourne | Travail mecanique, production passive | Le monde tourne deja. Il fallait accrocher une roue a son mouvement. | La puissance depend du lieu et de la meteo. |
| 4:05-5:20 | Charbon / vapeur | Ouvrir mine, chaudiere, machine a vapeur | Usine, fumee, battement mecanique | Argent, pollution, productivite | La machine ne dort pas. La ville non plus. | La puissance entre dans les poumons. |
| 5:20-6:20 | Electricite | Generateur, lignes, ville allumee | Nuit courte puis allumage brutal | Electricite, demande, reseau | L'energie devient invisible. C'est la qu'elle entre partout. | Il faut equilibrer offre et demande. |
| 6:20-7:15 | Petrole / gaz | Forer, raffiner, transporter, stabiliser au gaz | Zoom monde, routes, ports, avions | Carbone, dependances, prix mondial | La vitesse ressemble a la liberte, jusqu'au jour ou elle devient dependance. | Le carbone et la volatilite montent. |
| 7:15-8:05 | Fission | Recherche, reacteur, operateurs, confiance | Centrale calme, lumiere froide | Confiance, risque percu, dechets | Un gramme peut alimenter une ville. Une peur peut l'arreter. | La technique a besoin de confiance. |
| 8:05-9:15 | Solaire / vent moderne | Installer, renforcer reseau, effacer demande | Toits solaires, eoliennes, meteo | Intermittence, surplus, prix spot | Le probleme n'est plus seulement de produire. C'est de produire au bon moment. | L'abondance sans coordination cree une crise. |
| 9:15-10:00 | Stockage / 2026 | Batteries, pilotage, reconversion, HELIOS | Toutes les couches empilees, interface complete | Stabilite reseau, pilotage, HELIOS | 2026 : une civilisation ne manque pas seulement d'energie, elle manque de coordination. | HELIOS propose d'optimiser trop froidement. |

## Version demo 3 minutes

Le mode demo ne supprime aucune etape. Il raccourcit seulement les animations.

| Temps | Beat obligatoire | A ne pas couper |
| --- | --- | --- |
| 0:00-0:20 | Nuit -> etincelle | Le premier clic et le +1 J. |
| 0:20-0:40 | Feu -> groupe | Le soutien social nait du foyer. |
| 0:40-1:00 | Agriculture -> stock | Le champ comme lumiere stockee. |
| 1:00-1:20 | Eau / vent -> mecanique | La roue qui tourne sans clic. |
| 1:20-1:45 | Charbon -> vapeur | Le premier gros saut de production. |
| 1:45-2:05 | Electricite -> reseau | La ville qui s'allume. |
| 2:05-2:25 | Petrole / gaz -> monde | Le zoom routes/ports/carbone. |
| 2:25-2:40 | Fission -> confiance | Le choix non manicheen. |
| 2:40-2:55 | Renouvelables -> timing | Surplus, prix spot, intermittence. |
| 2:55-3:00 | 2026 -> HELIOS | Proposition d'optimisation. |

## Checklist anti-saut

Avant de valider une tranche, verifier :

- Le joueur a fait au moins une action nouvelle.
- Une jauge ou un panneau nouveau est apparu.
- La source d'energie precedente reste visible quelque part.
- Le texte explique le probleme, pas un cours d'histoire.
- Le prochain palier est cause par un blocage visible.

Exemples :

- Ne pas passer de feu a charbon : il faut d'abord montrer nourriture, population, force animale, moulins.
- Ne pas passer de charbon a petrole : il faut d'abord montrer l'electricite, sinon le reseau moderne arrive de nulle part.
- Ne pas passer de solaire a 2026 : il faut montrer stockage et pilotage, sinon les renouvelables semblent magiques.

## Priorite de production

Si le temps manque, construire dans cet ordre :

1. 0:00-1:00 : ouverture feu parfaite.
2. 1:00-4:05 : transitions bois, agriculture, moulins pour eviter le saut historique.
3. 4:05-6:20 : charbon puis electricite avec deux gros effets visuels.
4. 6:20-10:00 : monde moderne, carbone, confiance, intermittence, HELIOS.

La premiere minute accroche. Les minutes 2 a 4 prouvent que le projet est intelligent. Les minutes 4 a 10 donnent le vertige Paperclips.

## Definition de "ca claque"

Le debut claque si, avant 60 secondes :

- le joueur a clique ;
- une etincelle est devenue un feu ;
- un compteur est ne sous ses yeux ;
- le noir a recule ;
- le soutien social est apparu ;
- le joueur a compris que produire plus n'est pas toujours mieux.

Le passage a 2026 claque si, a 10 minutes :

- l'ecran montre toutes les couches energetiques encore empilees ;
- les jauges sont contradictoires mais lisibles ;
- HELIOS propose une solution trop simple ;
- le joueur comprend que le passe etait le tutoriel, pas le jeu complet.
