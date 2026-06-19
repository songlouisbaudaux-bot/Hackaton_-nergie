# V2 - Moments forts

## Intention

La V2 dure plus longtemps. Les moments forts evitent que les grandes attentes deviennent plates, surtout apres l'age spatial.

Chaque moment fort est un toast court, non bloquant, sans ouvrir de menu. Il est declenche une seule fois par sauvegarde puis reset avec `Recommencer`.

## Jalons actuels

| Id | Declencheur | Rôle |
| --- | --- | --- |
| `first-steam` | Achat `Machine a vapeur` | Premier vrai saut mecanique de l'age industriel. |
| `first-fission` | Technologie `Fission controlee` | L'atome devient une source stable. |
| `first-fusion` | Technologie `Plasma confine` | Premier changement d'echelle propre. |
| `first-orbital-solar` | Achat `Satellite collecteur` | Le Soleil devient une source continue. |
| `first-dyson-ring` | Technologie `Essaim de Dyson` | Moment waouh cible pour l'age Dyson. |
| `first-vacuum-seed` | Achat `Graine d'univers` | Preparation de la fin cosmique. |

## Integration

- Config : `src/game/data.ts`, export `breakthroughMilestones`.
- Type : `src/game/types.ts`, `BreakthroughMilestone`.
- Affichage : `src/components/game/BreakthroughToast.tsx`.
- Persistance : `achievedBreakthroughs` dans `prometheus-protocol:v2:progress:v1`.

## Prochaine passe

- Ajouter un effet specifique aux iles Dyson pendant `first-dyson-ring`.
- Ajouter un petit son ou vibration optionnelle si le jeu gagne une couche audio.
- Faire remonter les jalons dans le rapport d'equilibrage pour voir les minutes exactes ou ils tombent.
