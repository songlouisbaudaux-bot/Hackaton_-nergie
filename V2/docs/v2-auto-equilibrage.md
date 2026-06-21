# V2 - Boucle d'auto-equilibrage

## Intention

La V2 doit durer au moins 2 heures sans devenir molle au debut. Le debut reste rapide, puis le temps vient surtout des ages tardifs, de la limitation du spam d'achats repetables et d'un anti-spam sur le clic central.

Les technologies ne sont plus des bonus globaux independants. Elles ameliorent maintenant la production du batiment cible deja achete. Le facteur V2 est volontairement reduit : `65 %` de la valeur de la technologie par exemplaire du batiment.

## Boucle actuelle

Commande :

```bash
npm run balance:auto
```

La boucle teste automatiquement plusieurs valeurs de croissance des couts repetables. Elle simule maintenant quatre profils :

- `requiredOnly` : 1 clic/s, le joueur achete chaque objet et chaque technologie une fois.
- `aggressiveRepeat` : 1 clic/s, le joueur rachete les objets rentables si leur retour sur investissement est sous 600 secondes.
- `lowClickSteady` : 0.35 clic/s, le joueur clique moins et rachete seulement les objets rentables sous 420 secondes.
- `spamCapped` : 2 clics/s, soit le maximum autorise par l'anti-spam runtime de 500 ms.

Le script cherche une valeur qui garde le run le plus rapide au-dessus de 121 minutes, tout en signalant les profils trop lents ou trop rapides. Il ecrit aussi :

```text
docs/balance-v2-report.json
```

Pour appliquer la meilleure valeur trouvee :

```bash
npm run balance:auto -- --apply
```

Pour laisser la boucle tourner pendant une session d'iteration :

```bash
npm run balance:loop
```

Pour tester la boucle sans la laisser tourner :

```bash
npm run balance:loop -- --rounds=1 --interval-ms=10
```

Le rapport contient maintenant :

- les meilleurs candidats de croissance de cout ;
- `profileSummary`, avec le temps total de chaque profil joueur ;
- les moments forts configures dans `breakthroughs` ;
- la timeline des moments forts dans `flowDiagnostics` ;
- les creux entre moments forts, avec statut `ok`, `watch` ou `too-long` ;
- le run obligatoire, le run agressif, le run calme et le run spam plafonne ;
- `diagnostics.requiredOnly`, `diagnostics.aggressiveRepeat`, `diagnostics.lowClickSteady` et `diagnostics.spamCapped`, avec un statut par age ;
- une recommandation simple quand un age devient trop court, trop long ou a surveiller.
- une penalite de score pour les ages trop courts, trop longs et les creux de moments forts.

## Reglage applique

- Anti-spam clic central : `500 ms`, donc `2 clics/s` maximum.
- Bonus techno par batiment : `65 %`
- `COST_GROWTH = 5.60`
- Run obligatoire : `152.4 min`
- Run agressif : `122.7 min`
- Run calme, peu de clics : `141.1 min`
- Run spam plafonne : `121.0 min`
- Cible interne : `>= 121 min`

## Dernier diagnostic

- Le run spam plafonne reste valide : `121.04 min`, avec 2 clics/s.
- Le run agressif reste valide : `122.68 min`.
- Le profil calme reste valide : `141.11 min`, avec 0.35 clic/s.
- L'age `Dyson` reste long mais lisible : `41.88 min` sur le run agressif, avec plusieurs jalons internes.
- Action appliquee : ajout de `heliosphere-routing`, puis des moments forts `first-controlled-annihilation`, `black-hole-threshold`, `penrose-loop-locked`, `first-stellar-orbit`, `stellar-arteries` et `vacuum-threshold`.
- Les creux restants sont en `watch`, pas en `too-long`, sur les profils lent/minimal entre `penrose-loop-locked -> first-stellar-orbit` et `stellar-arteries -> vacuum-threshold`.
- Le debut a ete retendu : passage Prehistoire a `90 J`, Antiquite a `700 J`, Moyen Age a `2 200 J`, industriel a `10 000 J`.

## Pourquoi ce choix

Le jeu permet toujours d'acheter plusieurs fois les memes objets. Par contre, chaque achat supplementaire devient vite cher, les technologies renforcent surtout les objets deja possedes, et le clic central ne peut plus depasser 2 clics/s. Le joueur peut donc cliquer activement, mais pas transformer le jeu en autoclicker.

## Prochaines iterations

- Enrichir les objectifs intermediaires par age pour que les 2 heures aient plus de rythme.
- Ajouter des petits pics de feedback aux moments clefs : premiere vapeur, premiere fission, premiere structure orbitale.
- Ajouter un vrai micro-objectif entre trou noir et Dyson pour les profils lents.
- Ajouter un micro-objectif avant `vacuum-threshold` si la fin semble trop passive en playtest.
- Revoir les couts d'achat de base si certains ages deviennent trop passifs.
- Ajouter un profil de test "quasi idle" si la V2 doit pouvoir tourner avec tres peu de clics.
- Ajouter une vraie cinematique de fin si la V2 devient la branche jouable principale.
