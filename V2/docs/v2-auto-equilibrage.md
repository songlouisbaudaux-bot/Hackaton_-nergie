# V2 - Boucle d'auto-equilibrage

## Intention

La V2 doit durer au moins 2 heures sans devenir molle au debut. Le debut reste rapide, puis le temps vient surtout des ages tardifs et de la limitation du spam d'achats repetables.

## Boucle actuelle

Commande :

```bash
npm run balance:auto
```

La boucle teste automatiquement plusieurs valeurs de croissance des couts repetables. Elle simule deux profils :

- `requiredOnly` : le joueur achete chaque objet et chaque technologie une fois.
- `aggressiveRepeat` : le joueur rachete les objets rentables si leur retour sur investissement est sous 600 secondes.

Le script cherche une valeur qui garde le run le plus rapide au-dessus de 120 minutes. Il ecrit aussi :

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
- le run obligatoire et le run agressif ;
- `diagnostics.requiredOnly` et `diagnostics.aggressiveRepeat`, avec un statut par age ;
- une recommandation simple quand un age devient trop court, trop long ou a surveiller.

## Reglage applique

- `COST_GROWTH = 3.02`
- Run obligatoire : `130.6 min`
- Run agressif : `121.6 min`
- Cible : `>= 120 min`

## Dernier diagnostic

- Le run rapide reste valide : `121.56 min`.
- L'age `Dyson` est marque `watch` : `40.49 min` dans une bande cible `24-52 min`.
- Action recommandee : ajouter un moment fort Dyson, par exemple premier anneau stellaire visible, flash de production, ou objectif intermediaire avant le passage au Vide.

## Pourquoi ce choix

Le jeu permet toujours d'acheter plusieurs fois les memes objets. Par contre, chaque achat supplementaire devient vite cher, ce qui evite que le joueur transforme la partie en boucle optimale trop courte.

## Prochaines iterations

- Enrichir les objectifs intermediaires par age pour que les 2 heures aient plus de rythme.
- Ajouter des petits pics de feedback aux moments clefs : premiere vapeur, premiere fission, premiere structure orbitale.
- Simuler aussi un profil joueur plus lent, avec moins de clics.
- Revoir les couts d'achat de base si certains ages deviennent trop passifs.
