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
| `first-neutron-well` | Technologie `Cartographie pulsar` | Coupe le grand creux apres le solaire orbital. |
| `first-antimatter-bottle` | Technologie `Bouteilles magnetiques` | Rend l'antimatiere exploitable sans ouvrir de menu. |
| `first-black-hole-siphon` | Technologie `Mesure de Kerr` | Premier contact lisible avec l'energie des trous noirs. |
| `first-dyson-segment` | Achat `Segment orbital` | Coupe le creux entre trou noir et Dyson. |
| `first-dyson-ring` | Technologie `Essaim de Dyson` | Moment waouh cible pour l'age Dyson. |
| `stellar-grid-online` | Technologie `Gouvernance stellaire` | Coupe l'attente entre Dyson et le Vide. |
| `first-casimir-contact` | Achat `Fluctuateur Casimir` | Lance le Vide avant la fin cosmique. |
| `first-vacuum-seed` | Achat `Graine d'univers` | Preparation de la fin cosmique. |

## Integration

- Config : `src/game/data.ts`, export `breakthroughMilestones`.
- Type : `src/game/types.ts`, `BreakthroughMilestone`.
- Affichage : `src/components/game/BreakthroughToast.tsx`.
- Persistance : `achievedBreakthroughs` dans `prometheus-protocol:v2:progress:v1`.

## Impulsions temporaires

Pour rendre chaque action plus satisfaisante sans ajouter de menu ni de ressource permanente, la V2 ajoute une impulsion courte apres les actions importantes :

| Action | Effet |
| --- | --- |
| Achat | `Atelier en cadence`, bonus discret de production passive. |
| Technologie | `Rendement inspire`, bonus plus fort car la technologie valorise les batiments existants. |
| Passage d'age | `Nouvel age en marche`, bonus court et visible pour accompagner la transition. |

Regles :

- le bonus agit uniquement sur les `J/s`, pas sur le mix ni sur une nouvelle jauge ;
- relancer une action pendant l'impulsion la prolonge et l'amplifie legerement, avec plafond ;
- l'affichage reste un petit bandeau temporaire, cache hors impulsion ;
- le son utilise un cue court `impulse`, distinct des sons d'achat et de technologie.

## Prochaine passe

- Ajouter un effet specifique aux iles Dyson pendant `first-dyson-ring`.
- Faire remonter les jalons dans le rapport d'equilibrage pour voir les minutes exactes ou ils tombent.
