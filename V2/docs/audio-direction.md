# Direction audio V2

## Intention
- L'audio doit rendre le jeu plus agreable sans devenir envahissant.
- La musique reste douce, basse en volume, et accordee autour de gammes simples.
- Les bruitages donnent du feedback clair aux actions, sans punir le joueur ni saturer quand il clique vite.

## Implementation
- Le moteur vit dans `src/audio/`.
- Il utilise WebAudio directement, sans fichier sonore obligatoire et sans dependance lourde.
- Les reglages sont stockes dans `localStorage` via `prometheus-protocol:v2:audio:v1`.
- Le son ne demarre qu'apres interaction utilisateur, ce qui garde le comportement compatible iOS/Safari.

## Cues
| Cue | Moment |
| --- | --- |
| `manual-click` | clic central valide |
| `purchase` | achat d'un objet |
| `blocked` | action refusee par securite ou manque de J |
| `technology` | technologie recherchee |
| `age-transition` | passage d'age |
| `breakthrough` | moment fort narratif |
| `ending` | fin cosmique |
| `restart` | recommencer |
| `sandbox` | bac a sable |
| `intro-done` | sortie de l'intro |

## Themes
Chaque age change la couleur musicale sans changer le gameplay :

| Age | Couleur |
| --- | --- |
| Prehistoire | feu doux, pulsation lente |
| Antiquite | rythme terrestre, stable |
| Moyen Age | notes plus fluides eau/vent |
| Age industriel | pulsation plus mecanique |
| Age atomique | son plus propre et dense |
| Fusion | nappe plus brillante |
| Solaire orbital | mouvement plus rapide et clair |
| Puits de neutrons | texture plus cosmique |
| Antimatiere | tension legere, toujours accordee |
| Trou noir | grave lent et sombre |
| Dyson | energie stellaire ample |
| Vide | sons fins, espacieux |

## Regles
- Garder `masterVolume`, `musicVolume` et `sfxVolume` faibles par defaut.
- Ne pas ajouter de musique externe sans verifier les droits.
- Garder le bouton son accessible en haut a droite.
- Si des fichiers audio finaux arrivent plus tard, les brancher derriere les memes `AudioCueId`.
