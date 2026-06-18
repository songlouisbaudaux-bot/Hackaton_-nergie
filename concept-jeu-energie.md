# Concept — Jeu hackathon "Énergie" (style Universal Paperclips)

## Le pitch en une phrase
Un *incremental game* temps réel où tu incarnes notre monde actuel (humanité + IA) et où ta monnaie de production est le **kWh** : tu captes de l'énergie, tu la dépenses pour débloquer des technologies, tu grimpes l'échelle énergétique — et le but est de **survivre à chaque transition sans t'effondrer**.

## L'idée directrice
Reprendre la mécanique addictive de Paperclips (une seule boucle simple, mais une échelle qui explose en ordres de grandeur) et la mettre au service du sujet énergie. Le trombone devient le **watt**. La boucle unique : capter de l'énergie → la dépenser → débloquer une source plus puissante → recommencer plus gros.

Parti pris assumé : **optimiste**. Pas "l'énergie nous condamne" mais "l'énergie est le problème ET la sortie". Il existe un chemin où on franchit tous les murs sans s'autodétruire, mais le joueur doit le trouver en arbitrant. On peut s'en sortir, ce n'est pas automatique.

## Les 3 ressources (qui fusionnent tes 3 registres)
Tes trois pistes de départ ne sont plus trois sujets séparés, elles deviennent les trois jauges que tu équilibres :

1. **kWh (production)** — le compteur central, façon trombones. Monte avec tes centrales et ta montée sur l'échelle de Kardashev. → registre sci-fi / physique.
2. **€ (marché)** — tu vends tes kWh. Le prix bouge selon l'offre : plus tu produis (surtout solaire), plus le prix s'effondre à midi, jusqu'au prix négatif (le vrai *merit order*). Tu réinvestis le € pour débloquer la techno suivante. → registre éco.
3. **Soutien social** — ta jauge de survie. Charbon = € rapide mais pollution et soutien qui chute ; inégalité d'accès = révolte. Si elle tombe à zéro → effondrement (game over). → registre humain.

En arrière-plan, un **compteur carbone / climat** que la production remplit ; s'il explose, tout le monde morfle.

**La tension de jeu** : ces jauges se contredisent. Le chemin le plus rapide en énergie crame la société et le climat. Le chemin le plus propre est lent et cher. C'est cette contradiction qui rend le jeu intéressant — et qui exprime "ce qui nous détruit ET ce qui nous sauve" sans avoir à le dire : le joueur le vit.

## L'échelle énergétique (chiffrée VRAI = ce qui rend le jeu crédible)
Bois (~16 MJ/kg, clin d'œil EGGER) → charbon → pétrole / gaz → fission (uranium ~80 millions MJ/kg) → renouvelables + stockage → fusion → orbital / Dyson swarm. Chaque palier multiplie la production par des ordres de grandeur **réels**. Les nombres sont vrais : c'est ça qui distingue le jeu d'un truc inventé, et c'est un argument fort devant un jury.

## Le rôle du LLM (à implémenter plus tard)
Le moteur du jeu est **scripté et tourne en temps réel** (compteurs, coûts qui montent, jauges gérées par des règles dures) — solide, équilibrable, sans appel API. Par-dessus, un **concurrent incarné par un LLM** grimpe la même échelle en face de toi. Points clés :
- Il représente une vraie présence : il progresse, il parle, il réagit à ta façon de jouer.
- **Si tu joues mal, il te dépasse pour de vrai** — c'est lui qui crée l'enjeu.
- Subtilité : le moteur scripté calcule sa progression ; le LLM lui donne une **personnalité et des réactions** (il commente, il nargue quand tu stagnes, il annonce ses coups, son ton change selon qui mène). Résultat : chaque partie est différente narrativement, tout en restant équilibrée mécaniquement.
- Contrainte temps réel : on n'appelle pas le LLM à chaque tick. Il "parle" aux **moments-clés** (palier franchi, écart qui se creuse, choix risqué) ; entre deux, le moteur fait avancer le concurrent seul.

(Piste satirique cohérente avec l'optimisme : le concurrent-IA n'a pas de jauge sociale, il optimise le kWh pur, donc il va plus vite au début — mais il fonce dans le mur qu'il a ignoré. L'humain "inefficace" qui prend soin du social gagne sur la durée. C'est une réponse directe au cauchemar de Paperclips, pas une copie.)

## Forme et ambiance
- **Forme** : incremental game web, **temps réel** (regarder les compteurs grimper = addictif, feeling Paperclips).
- **Ambiance** : claire, blanche, lumineuse, "heureuse" — cohérent avec le ton optimiste. Piste à explorer : le jeu **s'éclaire** à mesure qu'on grimpe l'échelle (du brun-bois au doré-stellaire), pour rendre l'optimisme visible à l'écran.

## Faisabilité 48h
La forme la plus réaliste de toutes les idées envisagées : un incremental, c'est mécaniquement simple (compteurs, boutons, coûts croissants, boucle `setInterval`). Pas de 3D, pas de physique. React/JS pur, et le LLM en surcouche via les appels Claude possibles dans un artifact. Proto jouable possible dès la fin de la journée 1, puis jour 2 pour le polish + le branchement du concurrent IA.

**Le vrai risque n'est pas le code, c'est l'équilibrage.** Un incremental mal équilibré est soit trivial soit injouable. Garder du temps jour 2 pour ça, et garder la V1 simple (3 jauges, pas 6).

## Ce qui reste à figer avant de coder
- Le nom du jeu.
- La liste précise des paliers et leurs vrais chiffres (densités énergétiques, coûts, multiplicateurs).
- Les actions concrètes du joueur à chaque palier (sur quoi on clique).
- Les seuils des jauges (quand le social s'effondre, quand le prix devient négatif).
- Le déclenchement précis des interventions du concurrent.
