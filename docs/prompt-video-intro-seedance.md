# Prompt video intro - Prometheus Protocol

Objectif : generer une courte cinematique d'introduction pour le jeu, en style 3D minimaliste, sans texte, sans parole, avec son d'ambiance.

## Prompt unique Seedance

```text
Create a cinematic introduction video for a minimalist 3D incremental game about the discovery of fire and energy.

Style: soft 3D minimalist, toy-like, rounded shapes, slightly stylized prehistoric world, clean game cinematic, warm and readable, not photorealistic, not dark horror, no realistic violence.

Duration: around 18 to 24 seconds.
Aspect ratio: 16:9.
Camera: cinematic but simple, slow camera movements, close-ups mixed with wide shots, smooth transitions, no shaky handheld style.

Story:
At night, inside a primitive cave, a prehistoric man wakes up suddenly. The cave is dark and cold. Outside, a storm is raging. He carefully walks to the cave entrance and looks out. In the distance there is a small primitive tent and a few trees under heavy rain. A bright lightning strike hits one tree. The tree catches fire. The man watches the flames with fear, curiosity, and wonder. The warm firelight reflects on his face.

Then the scene cuts back inside the cave. The man draws simple pictograms on the cave wall: a tree, lightning, sparks, stones, and a flame. These are drawings only, no readable writing, no symbols that look like text. He is trying to understand how fire appears.

Finally, he kneels near dry grass and small wood pieces. He strikes two flint stones together. First small sparks fail. He tries again. A spark catches. A tiny flame appears, then grows into a small controlled campfire. The cave warms with orange light. The man leans closer, amazed and calm. The final image is the first fire glowing softly in the dark cave, suggesting the beginning of human energy.

Sound design:
No spoken words. No narration. No subtitles. No music with lyrics.
Use only sound effects and atmospheric sound: distant night wind, soft breathing, rain outside, thunder rumble, lightning crack, footsteps on stone, cave echo, charcoal scratching on cave wall, flint clicking, tiny sparks, dry grass catching fire, warm fire crackle, subtle low cinematic pulse.

Important constraints:
No text anywhere in the image.
No captions, no subtitles, no UI, no logos, no watermarks.
No speech, no voice, no words.
No modern objects, no metal tools, no torches at the beginning, no advanced clothing, no buildings beyond a primitive tent.
Keep the prehistoric man simple, rounded, toy-like, expressive but not realistic.
Keep the fire magical and important, but natural and believable.
The mood should be mysterious, warm, and foundational: humanity discovering that energy can be captured.
```

## Version decoupee en plans

Si Seedance gere mieux des videos courtes, generer ces plans separement puis les monter dans l'ordre.

### Plan 1 - Reveil dans la grotte

```text
Soft 3D minimalist cinematic. Night inside a primitive cave. A rounded toy-like prehistoric man wakes up on the cave floor, cold and worried. The cave is dark, only faint blue moonlight from the entrance. Slow close-up, no text, no speech, no subtitles, no UI. Sound: quiet wind, distant thunder, soft breathing, cave echo.
```

### Plan 2 - La tempete dehors

```text
Soft 3D minimalist cinematic. The prehistoric man walks to the cave entrance and looks outside. Heavy night storm, rain, primitive tent in the distance, a few rounded trees moving in the wind. Slight isometric toy-like world, clean and readable. No text, no speech, no subtitles, no UI. Sound: rain, wind, distant thunder, footsteps on stone.
```

### Plan 3 - L'eclair et l'arbre en feu

```text
Soft 3D minimalist cinematic. A bright lightning bolt hits a rounded prehistoric tree near the primitive camp. The tree catches fire with warm orange flames. The prehistoric man watches from the cave entrance, his face lit by the fire, amazed and afraid. No text, no speech, no subtitles, no UI. Sound: lightning crack, thunder impact, rain, first flames crackling.
```

### Plan 4 - Observation du feu

```text
Soft 3D minimalist cinematic close-up. The burning tree glows in the rain. The prehistoric man studies the fire carefully, reflected warm light in his eyes, realizing something important. Keep it toy-like, rounded, not realistic, not violent. No text, no speech, no subtitles, no UI. Sound: rain softening, fire crackle, low cinematic pulse.
```

### Plan 5 - Dessins dans la grotte

```text
Soft 3D minimalist cinematic. Back inside the cave, the prehistoric man draws simple pictograms on the cave wall: tree, lightning, stone sparks, flame. These are primitive drawings only, not readable writing and no text. He points, thinks, and studies the drawings. No speech, no subtitles, no UI. Sound: cave echo, charcoal scratching stone, distant storm outside.
```

### Plan 6 - Les silex

```text
Soft 3D minimalist cinematic close-up. The prehistoric man kneels near dry grass, small twigs, and two flint stones. He strikes the stones together. Tiny sparks appear and fade. He tries again with focus. No text, no speech, no subtitles, no UI. Sound: stone clicks, tiny sparks, quiet breathing, cave ambience.
```

### Plan 7 - Naissance du feu

```text
Soft 3D minimalist cinematic. A spark catches in dry grass. A tiny flame appears, then grows into a small controlled campfire. Warm orange light fills the cave. The prehistoric man smiles softly, amazed and calm. No text, no speech, no subtitles, no UI. Sound: spark catch, small flame whoosh, gentle fire crackle, warm low cinematic tone.
```

### Plan 8 - Image finale

```text
Soft 3D minimalist cinematic final shot. The first small campfire burns steadily inside the cave, casting warm light on the prehistoric man and the cave drawings behind him. The outside storm fades into the background. The image should feel like the beginning of human energy and civilization. No text, no speech, no subtitles, no UI, no logo, no watermark. Sound: calm fire crackle, distant rain, subtle warm cinematic pulse.
```

## Negative prompt global

```text
No text, no subtitles, no captions, no readable symbols, no UI, no logo, no watermark, no speech, no narration, no modern objects, no modern clothes, no metal tools, no guns, no houses, no city, no realistic violence, no horror, no photorealistic documentary style, no flat 2D cartoon, no messy clutter, no over-detailed cave, no camera shake, no dramatic epic fantasy armor, no magic spells.
```

## Note de montage

La cinematique peut fonctionner en 20 secondes environ :

- 0-3s : reveil dans la grotte.
- 3-6s : sortie et tempete.
- 6-9s : eclair, arbre en feu.
- 9-13s : retour dans la grotte et dessins.
- 13-18s : silex, etincelles, feu.
- 18-22s : feu stable, transition vers le gameplay.
