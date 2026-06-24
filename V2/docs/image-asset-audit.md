# Audit des images runtime V2

## Commande
```bash
npm run audit:assets
```

Le script relit `src/game/data.ts`, verifie tous les `assetFile` des achats et technologies, et echoue si :
- une image est absente ;
- une image ne vient pas de `images-finales-gpt-image/` ;
- une image pointe vers un ancien dossier d'assets.

Pour generer la table complete image / achat / technologie :

```bash
node scripts/audit-assets.mjs --markdown
```

## Etat actuel
- Mappings runtime verifies : 66.
- Images manquantes : 0.
- Ancien dossier utilise : 0.
- Reutilisations signalees : 9.

Ces reutilisations ne cassent pas le build, mais elles expliquent les doublons visibles en fin de jeu.

| Image reutilisee | Usages |
| --- | --- |
| `atomic/island-atomic-07-built-fusion-plant.png` | `fusion-tokamak`, `laser-fusion` |
| `atomic/island-atomic-07-upgraded-controlled-fusion.png` | `stellarator`, `plasma-confinement`, `laser-compression` |
| `orbital-solar/island-orbital-solar-07-built-collector.png` | `orbital-collector`, `laser-relay`, `sps-alpha`, `coherent-transmission`, `orbital-phase-lock` |
| `cosmic/island-cosmic-08-neutron-wells.png` | `pulsar-probe`, `gravity-antenna`, `neutron-mill`, `pulsar-mapping`, `neutron-orbits` |
| `atomic/island-atomic-08-built-antimatter.png` | `antimatter-accelerator`, `annihilation-reactor` |
| `atomic/island-atomic-08-upgraded-antimatter-containment.png` | `magnetic-trap`, `magnetic-bottles`, `controlled-annihilation` |
| `cosmic/island-cosmic-10-black-hole-siphon.png` | `ergosphere-probe`, `gravity-anchor`, `penrose-extractor`, `kerr-measure`, `penrose-stability` |
| `dyson/island-dyson-11-built-stellar-swarm.png` | `dyson-segment`, `space-foundry`, `energy-distribution`, `dyson-swarm`, `stellar-governance`, `heliosphere-routing` |
| `cosmic/island-cosmic-12-vacuum-universe-seed.png` | `casimir-fluctuator`, `vacuum-lattice`, `universe-seed`, `casimir-geometry`, `cosmic-reboot` |

## Suite asset
- Priorite 1 : remplacer les doublons `orbital-solar`, `dyson`, `vacuum`.
- Priorite 2 : ajouter des variantes distinctes pour `neutron-wells`, `black-hole`, `antimatter`.
- Garder le chemin runtime unique : `/assets/game/images-finales-gpt-image/...`.
