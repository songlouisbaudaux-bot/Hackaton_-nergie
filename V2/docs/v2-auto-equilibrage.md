# V2 - Boucle d'auto-equilibrage

## Intention

La V2 doit durer au moins 2 heures sans devenir molle au debut. Le debut reste rapide, puis le temps vient surtout des ages tardifs et de la limitation du spam d'achats repetables.

## Boucle actuelle

Commande :

```bash
npm run balance:auto
```

La boucle teste automatiquement plusieurs valeurs de croissance des couts repetables. Elle simule maintenant trois profils :

- `requiredOnly` : 1 clic/s, le joueur achete chaque objet et chaque technologie une fois.
- `aggressiveRepeat` : 1 clic/s, le joueur rachete les objets rentables si leur retour sur investissement est sous 600 secondes.
- `lowClickSteady` : 0.35 clic/s, le joueur clique moins et rachete seulement les objets rentables sous 420 secondes.

Le script cherche une valeur qui garde le run le plus rapide au-dessus de 120 minutes, tout en signalant les profils trop lents. Il ecrit aussi :

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
- le run obligatoire, le run agressif et le run calme ;
- `diagnostics.requiredOnly`, `diagnostics.aggressiveRepeat` et `diagnostics.lowClickSteady`, avec un statut par age ;
- une recommandation simple quand un age devient trop court, trop long ou a surveiller.

## Reglage applique

- `COST_GROWTH = 3.02`
- Run obligatoire : `130.6 min`
- Run agressif : `121.6 min`
- Run calme, peu de clics : `125.3 min`
- Cible : `>= 120 min`

## Dernier diagnostic

- Le run rapide reste valide : `121.56 min`.
- Le profil calme reste valide : `125.26 min`, avec 0.35 clic/s.
- L'age `Dyson` est marque `watch` : `40.49 min` dans une bande cible `24-52 min`.
- Action appliquee : ajout des moments forts `first-neutron-well`, `first-antimatter-bottle`, `first-black-hole-siphon`, `first-dyson-segment`, `first-dyson-ring`, `stellar-grid-online` et `first-casimir-contact`.
- Le rapport ne signale plus de creux `too-long` sur le run agressif.
- Les memes creux `watch` restent visibles sur les profils, surtout `first-black-hole-siphon -> first-dyson-segment` et `stellar-grid-online -> first-casimir-contact`.

## Pourquoi ce choix

Le jeu permet toujours d'acheter plusieurs fois les memes objets. Par contre, chaque achat supplementaire devient vite cher, ce qui evite que le joueur transforme la partie en boucle optimale trop courte.

## Prochaines iterations

- Enrichir les objectifs intermediaires par age pour que les 2 heures aient plus de rythme.
- Ajouter des petits pics de feedback aux moments clefs : premiere vapeur, premiere fission, premiere structure orbitale.
- Ajouter un micro-objectif visuel dans les deux creux `watch` si les playtests les trouvent encore trop plats.
- Revoir les couts d'achat de base si certains ages deviennent trop passifs.
- Ajouter un profil de test "quasi idle" si la V2 doit pouvoir tourner avec tres peu de clics.
