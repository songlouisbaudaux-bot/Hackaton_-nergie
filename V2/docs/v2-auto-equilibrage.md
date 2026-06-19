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

## Reglage applique

- `COST_GROWTH = 3.02`
- Run obligatoire : `130.6 min`
- Run agressif : `121.6 min`
- Cible : `>= 120 min`

## Pourquoi ce choix

Le jeu permet toujours d'acheter plusieurs fois les memes objets. Par contre, chaque achat supplementaire devient vite cher, ce qui evite que le joueur transforme la partie en boucle optimale trop courte.

## Prochaines iterations

- Ajouter des objectifs intermediaires par age pour que les 2 heures aient plus de rythme.
- Ajouter des petits pics de feedback aux moments clefs : premiere vapeur, premiere fission, premiere structure orbitale.
- Simuler aussi un profil joueur plus lent, avec moins de clics.
- Ajouter un rapport par age avec les moments creux a corriger.
- Revoir les couts d'achat de base si certains ages deviennent trop passifs.
