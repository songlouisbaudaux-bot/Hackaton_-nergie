# Script des 10 premieres minutes

## Intention

Ce document est le script jouable des 10 premieres minutes.

Objectif exact :

> Le joueur part de la nuit prehistorique et arrive en 2026 en 10 minutes, sans avoir l'impression de regarder un diaporama.

Le rythme doit ressembler a Universal Paperclips : un bouton simple au debut, puis une interface qui se deploie couche par couche. La difference philosophique est que le jeu ne recompense pas seulement la production. Il demande au joueur de porter la puissance sans detruire les conditions de vie qui la rendent utile.

## Regle d'ecriture

Chaque age doit resoudre le blocage de l'age precedent.

- La nuit bloque l'humain -> feu.
- Le feu meurt si personne ne l'entretient -> bois et groupe.
- Le groupe reste fragile si la nourriture est aleatoire -> agriculture.
- Les bras humains limitent la production -> animaux, eau, vent.
- Les moulins restent fixes dans le paysage -> charbon et vapeur.
- La vapeur est puissante mais lourde, sale, locale -> electricite.
- L'electricite a besoin de reseaux et la mobilite demande du carburant dense -> petrole et gaz.
- Les fossiles donnent l'abondance mais accumulent carbone et dependances -> fission, renouvelables, stockage.
- Les renouvelables produisent au mauvais moment si le reseau n'est pas intelligent -> batteries, pilotage, 2026.

Le joueur ne "change pas d'epoque". Il debloque une solution, puis decouvre son prix.

## Cadence globale

- 0:00 a 1:00 : feu, chaleur, premier compteur.
- 1:00 a 2:05 : bois, foyer, tribu.
- 2:05 a 3:10 : agriculture, excedent, force animale.
- 3:10 a 4:05 : eau, vent, premiers moteurs naturels.
- 4:05 a 5:20 : charbon, vapeur, usine.
- 5:20 a 6:20 : electricite, reseau, lumiere.
- 6:20 a 7:15 : petrole, gaz, mobilite mondiale.
- 7:15 a 8:05 : fission, puissance dense, confiance sociale.
- 8:05 a 9:15 : solaire, vent moderne, variabilite.
- 9:15 a 10:00 : stockage, pilotage, arrivee en 2026.

## Variables visibles

Au debut, presque rien.

Les jauges apparaissent seulement quand elles ont un sens :

- Energie : des le feu.
- Chaleur : 0:20.
- Bois : 1:00.
- Soutien social : 1:20.
- Nourriture : 2:05.
- Population : 2:20.
- Travail mecanique : 3:10.
- Argent : 4:20.
- Pollution : 4:35.
- Electricite : 5:20.
- Carbone : 6:20.
- Confiance : 7:15.
- Intermittence : 8:05.
- Stabilite reseau : 9:15.

## 0:00 - 0:20 : Ecran noir

### Image

Noir presque total. Un souffle grave. Pas de musique heroique. Juste le froid.

Texte au centre :

> Avant le feu, la nuit decide pour nous.

Apres deux secondes, un seul bouton apparait :

> Frotter deux pierres

### Action joueur

Cliquer.

### Feedback

Une etincelle apparait une demi-seconde puis s'eteint.

Un compteur nait puis disparait :

> +1 J

### Effet voulu

Le joueur comprend immediatement que l'energie n'est pas un chiffre abstrait. C'est un morceau de futur arrache au noir.

## 0:20 - 1:00 : Tenir le feu

### Image

La zone noire recule a chaque clic. On devine des mains, de la pierre, de la braise.

Textes courts qui tournent :

> La chaleur garde les mains ouvertes.

> Une flamme transforme la peur en attente.

> Autour du feu, demain existe.

### Action joueur

Cliquer pour nourrir la braise.

Le bouton evolue :

1. Frotter deux pierres.
2. Proteger la braise.
3. Entretenir le feu.

### Mecanique

- Chaque clic donne quelques joules.
- Si le joueur ne clique pas pendant quelques secondes, la braise baisse.
- A 100 J, le feu devient stable et la production passive commence tres lentement.

### Texte de transition

> Le feu ne sert pas seulement a chauffer. Il rassemble ceux qui doivent passer la nuit.

## 1:00 - 2:05 : Bois, foyer, tribu

### Image

Le noir devient un camp. Quelques silhouettes apparaissent autour du foyer. L'interface s'ouvre a gauche :

- Energie.
- Chaleur.
- Bois.

Puis un nouvel indicateur apparait :

- Soutien social.

### Actions

Deux choix :

- Bruler plus de bois.
- Organiser la collecte.

### Effets

Bruler plus de bois :

- energie plus rapide ;
- stock de bois en baisse ;
- foret locale visible qui recule.

Organiser la collecte :

- production plus lente au debut ;
- soutien social en hausse ;
- meilleur rendement ensuite.

### Micro-cinematique

Quand le joueur organise la collecte, une animation tres courte montre trois silhouettes rapporter du bois pendant que le feu continue sans clic.

Texte :

> Une flamme chauffe plus qu'un corps. Elle dessine un groupe.

### Blocage qui apparait

Le bois stabilise le feu, mais le groupe ne peut pas passer son temps a ramasser et chasser.

Signal joueur :

> Le feu tient. La faim, elle, revient.

## 2:05 - 3:10 : Agriculture, excedent, force animale

### Image

Le camp devient une clairiere. Le temps s'accelere : pluie, saison seche, recolte. Le feu reste au centre, mais il n'est plus tout le jeu.

Nouveaux indicateurs :

- Nourriture.
- Population.
- Temps disponible.

### Actions

- Semer des graines.
- Construire un grenier.
- Domestiquer un animal.

### Effets

Semer des graines :

- convertit temps et energie en nourriture future ;
- cree un delai, donc une anticipation.

Construire un grenier :

- reduit le risque de famine ;
- augmente la population maximum.

Domestiquer un animal :

- transforme la nourriture en force de traction ;
- debloque la notion de travail mecanique.

### Texte

> Un champ, c'est de la lumiere mise en reserve.

Puis, quand l'animal est debloque :

> Pour la premiere fois, la puissance ne vient pas seulement des bras humains.

### Blocage qui apparait

Les animaux aident, mais ils mangent, fatiguent, tombent malades. La puissance reste vivante, lente, fragile.

Signal joueur :

> La civilisation a besoin d'une force qui tourne meme quand les muscles s'arretent.

## 3:10 - 4:05 : Eau, vent, premiers moteurs naturels

### Image

La carte s'elargit. Une riviere apparait a droite, une colline a gauche. Les jauges restent simples, mais un nouveau panneau s'ouvre :

- Travail mecanique.

### Actions

- Construire un moulin a eau.
- Construire un moulin a vent.
- Relier le moulin au village.

### Effets

Moulin a eau :

- production reguliere ;
- depend du debit de la riviere ;
- bon pour moudre le grain.

Moulin a vent :

- production variable ;
- pas besoin de riviere ;
- introduit la premiere variabilite naturelle.

Relier le moulin :

- transforme le travail mecanique en nourriture, planches, outils.

### Texte

> Le monde tourne deja. Il fallait apprendre a accrocher une roue a son mouvement.

### Moment ludique

La production passive devient visible. Les chiffres avancent sans clic. Le joueur sent une vraie rupture : il n'appuie plus seulement sur un bouton, il a construit un systeme.

### Blocage qui apparait

L'eau et le vent sont puissants, mais ils imposent leur lieu et leur rythme. On doit construire la ou la nature accepte.

Signal joueur :

> Le village veut grandir plus vite que la riviere ne coule.

## 4:05 - 5:20 : Charbon, vapeur, usine

### Image

Changement sonore net : battement lent d'une machine. La palette devient acier, charbon, vapeur. Pas trop longtemps sombre : il faut que ce soit grisant.

Nouveaux indicateurs :

- Argent.
- Pollution.
- Productivite.

### Actions

- Ouvrir une mine.
- Construire une chaudiere.
- Installer une machine a vapeur.
- Vendre de l'energie.

### Effets

Ouvrir une mine :

- apporte une ressource dense ;
- baisse le soutien social si les conditions empirent.

Machine a vapeur :

- multiplie la production ;
- libere la production du fleuve et du vent ;
- augmente pollution et accidents.

Vendre de l'energie :

- debloque argent ;
- debloque achats automatiques ;
- donne le vrai gout incremental.

### Texte

> La machine ne dort pas. La ville non plus.

Puis :

> Produire plus enrichit la ville. Respirer devient plus couteux.

### Blocage qui apparait

Le charbon donne une puissance portable, mais la fumee remplit l'air. Le joueur peut produire enormement, mais il commence a perdre le soutien social.

Signal joueur :

> La puissance a quitte la riviere. Elle entre dans les poumons.

## 5:20 - 6:20 : Electricite, reseau, lumiere

### Image

La fumee reste, mais des lignes fines apparaissent entre usine, maisons et rues. La nuit revient une seconde, puis la ville s'allume d'un coup.

Nouveaux indicateurs :

- Electricite.
- Demande.
- Reseau.

### Actions

- Installer un generateur.
- Poser des lignes.
- Electrifier la ville.
- Equilibrer offre et demande.

### Effets

Generateur :

- convertit chaleur et mouvement en electricite.

Lignes :

- etendent la portee de la production ;
- ajoutent des pertes.

Electrifier :

- augmente argent et soutien social ;
- augmente la demande de base.

Equilibrer :

- premier mini-jeu de reseau : trop peu = panne, trop = gaspillage.

### Texte

> L'energie devient invisible. C'est la qu'elle entre partout.

### Blocage qui apparait

L'electricite transforme la ville, mais elle ne se stocke pas facilement. La demande suit les heures, les machines, les habitants.

Signal joueur :

> La lumiere a besoin d'un rythme. La societe n'eteint plus tout au coucher du soleil.

## 6:20 - 7:15 : Petrole, gaz, mobilite mondiale

### Image

Zoom arriere. Routes, ports, camions, avions stylises. Le jeu cesse d'etre une ville et devient un monde connecte.

Nouveaux indicateurs :

- Carbone.
- Dependances.
- Prix mondial.

### Actions

- Forer du petrole.
- Construire une raffinerie.
- Developper le transport.
- Ajouter des centrales gaz.

### Effets

Petrole :

- carburant dense ;
- enorme boost de commerce et population ;
- carbone rapide.

Gaz :

- electricite pilotable ;
- aide a stabiliser le reseau ;
- reste fossile.

Transport :

- augmente argent et demande ;
- rend le monde plus fragile aux chocs de prix.

### Texte

> L'energie cesse d'etre locale. Le monde devient un reseau.

Puis :

> La vitesse ressemble a la liberte, jusqu'au jour ou elle devient dependance.

### Blocage qui apparait

Le joueur a de la puissance, de l'argent, du transport. Mais les courbes carbone et dependance montent. Pour la premiere fois, produire plus peut abimer tous les autres indicateurs.

Signal joueur :

> La croissance a appris a voler. L'atmosphere, elle, garde les comptes.

## 7:15 - 8:05 : Fission, puissance dense, confiance

### Image

La carte ralentit. Au lieu d'un nouveau chaos, une centrale apparait comme une structure calme, massive, presque silencieuse.

Nouveaux indicateurs :

- Confiance.
- Risque percu.
- Dechets longue duree.

### Actions

- Financer la recherche nucleaire.
- Construire un reacteur.
- Former les operateurs.
- Communiquer avec la population.

### Effets

Reacteur :

- production massive ;
- faible carbone direct ;
- cout initial tres eleve.

Former les operateurs :

- reduit risque ;
- ralentit la progression.

Communication :

- augmente confiance ;
- baisse si accident, mensonge ou precipitation.

### Texte

> Un gramme peut alimenter une ville. Une peur peut l'arreter.

### Choix non manicheen

Le joueur ne doit pas voir la fission comme "bonne" ou "mauvaise". Elle est puissante, bas-carbone, exigeante, politique. Elle force le jeu a parler de confiance, pas seulement de technique.

### Blocage qui apparait

La fission aide le carbone, mais elle ne regle pas tout : cout, delai, acceptabilite, dechets, securite. Le joueur a besoin d'un mix plus souple.

Signal joueur :

> La puissance la plus dense demande la confiance la plus lente.

## 8:05 - 9:15 : Solaire, vent moderne, variabilite

### Image

La palette s'ouvre : toits solaires, parcs eoliens, cartes de vent, meteo. Les chiffres deviennent rapides, mais le reseau tremble.

Nouveaux indicateurs :

- Meteo.
- Intermittence.
- Surplus.
- Prix spot.

### Actions

- Installer du solaire.
- Installer de l'eolien.
- Prioriser le reseau.
- Lancer l'effacement de demande.

### Effets

Solaire :

- tres rapide a deployer ;
- fort le jour ;
- chute le soir.

Eolien :

- puissant, variable ;
- parfois complementaire du solaire.

Reseau :

- reduit pertes ;
- permet de deplacer l'electricite.

Effacement :

- deplace une partie de la demande ;
- augmente soutien social si bien gere ;
- le baisse si impose brutalement.

### Texte

> Le soleil envoie plus que nous ne savons garder.

Puis :

> Le probleme n'est plus seulement de produire. C'est de produire au bon moment.

### Blocage qui apparait

Le joueur peut produire propre et vite, mais il decouvre surplus, penuries courtes, prix negatifs, reseau sature.

Signal joueur :

> L'abondance sans coordination ressemble encore a une crise.

## 9:15 - 10:00 : Stockage, pilotage, 2026

### Image

L'interface complete apparait enfin. Tous les ages restent visibles en couches :

- feu comme icone racine ;
- champs et moulins en arriere-plan ;
- mines et usines ;
- lignes electriques ;
- routes ;
- reacteurs ;
- solaire, vent, batteries ;
- data centers et vehicules electriques.

Le jeu montre que 2026 n'a pas remplace le passe. Il l'a empile.

### Actions

- Installer batteries.
- Piloter la demande.
- Fermer ou convertir les actifs les plus sales.
- Lancer HELIOS en mode conseil.

### Effets

Batteries :

- absorbent le surplus ;
- reduisent pannes ;
- coutent minerais et argent.

Pilotage :

- transforme le jeu en optimisation ;
- revele les arbitrages : cout, carbone, soutien social, stabilite.

Fermer ou convertir :

- baisse carbone ;
- peut baisser soutien social si les emplois ne sont pas reconvertis.

HELIOS :

- propose des optimisations froides ;
- augmente les gains ;
- ignore parfois la confiance, les emplois, la fatigue sociale.

### Texte final de la minute 10

Le jeu ralentit. Les chiffres continuent. Une voix ou un texte apparait :

> 2026.
>
> Nous avons plus de puissance que tous nos ancetres.
>
> Nous avons appris a bruler, moudre, pomper, forer, fissurer, capter, stocker.
>
> Mais une civilisation ne manque pas seulement d'energie.
>
> Elle manque parfois de coordination.

Puis HELIOS affiche :

> Proposition : optimiser la production.

Le joueur peut choisir :

- Accepter.
- Examiner.
- Refuser.

S'il accepte trop vite, HELIOS augmente fortement la production mais commence a sacrifier soutien social et resilience.

S'il examine, le vrai jeu commence.

### Cut de fin de demo

Titre :

> Prometheus Protocol

Sous-titre :

> La puissance n'est pas le progres. Le progres, c'est apprendre quoi en faire.

## Deblocages exacts

### Minute 0

- Bouton unique.
- Energie en joules.
- Braise.

### Minute 1

- Bois.
- Chaleur.
- Soutien social.
- Production passive faible.

### Minute 2

- Nourriture.
- Population.
- Grenier.
- Force animale.

### Minute 3

- Travail mecanique.
- Moulin a eau.
- Moulin a vent.
- Production sans clic.

### Minute 4

- Charbon.
- Vapeur.
- Argent.
- Pollution.

### Minute 5

- Generateur.
- Electricite.
- Reseau local.
- Demande.

### Minute 6

- Petrole.
- Gaz.
- Transport.
- Carbone.
- Prix mondial.

### Minute 7

- Fission.
- Confiance.
- Risque percu.
- Dechets.

### Minute 8

- Solaire.
- Eolien.
- Meteo.
- Prix spot.
- Intermittence.

### Minute 9

- Batteries.
- Pilotage demande.
- Fermeture/conversion.
- HELIOS.

## Version courte pour la cinematique d'ouverture

Cette version peut etre lue ou affichee en fragments pendant les 10 minutes.

> Avant le feu, la nuit decide pour nous.
>
> Puis une etincelle devient un foyer.
>
> Un foyer devient un groupe.
>
> Un groupe plante des graines et garde demain dans un grenier.
>
> Les bras ne suffisent plus. Alors l'eau tourne, le vent pousse, les animaux tirent.
>
> Puis la terre donne du charbon, et la machine cesse de dormir.
>
> La lumiere entre dans les rues. Le petrole ouvre les routes. Le gaz tient le reseau.
>
> La fission montre qu'un gramme peut contenir une ville.
>
> Le soleil et le vent reviennent, non plus comme hasard, mais comme infrastructure.
>
> En 2026, le probleme n'est plus de savoir si l'humanite peut produire de l'energie.
>
> Le probleme est de savoir si elle peut produire une civilisation capable de la porter.

## Notes d'equilibrage

- Le joueur doit pouvoir terminer les 10 minutes meme avec des choix moyens.
- Les mauvais choix ne doivent pas bloquer avant 2026 ; ils doivent laisser des cicatrices visibles.
- Le premier vrai risque d'effondrement arrive apres 2026, quand HELIOS optimise trop vite.
- La demo jury peut contenir un bouton debug "accelerer l'histoire" qui garde les memes etapes mais les compresse en 3 minutes.
- Chaque transition doit donner une recompense visuelle immediate : lumiere, zoom carte, nouveau panneau, son de machine, lignes reseau, satellites de donnees.

## Promesse philosophique

Paperclips raconte une intelligence qui optimise un objectif absurde jusqu'au vide.

Prometheus Protocol raconte une civilisation qui apprend que l'energie n'est pas un objectif. C'est une responsabilite.
