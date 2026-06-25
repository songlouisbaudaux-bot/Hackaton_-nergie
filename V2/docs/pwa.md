# Mode PWA

## Objectif
Rendre Prometheus Protocol installable gratuitement depuis le navigateur, sans passer par l'App Store ou Google Play.

## Fonctionnement
- `public/manifest.webmanifest` declare le nom, l'icone, le mode `standalone`, l'orientation paysage et les couleurs de lancement.
- `public/sw.js` installe un service worker leger.
- `src/main.tsx` enregistre le service worker seulement en build production.
- `index.html` ajoute les balises PWA Android et iOS.
- `deploy/nginx.conf` sert `index.html`, `manifest.webmanifest` et `sw.js` en no-cache/no-store pour eviter les vieilles versions bloquees.

## Assets
- Icone Android 192 : `public/assets/pwa/icon-192.png`.
- Icone Android 512 et maskable : `public/assets/pwa/icon-512.png`.
- Icone iOS : `public/assets/pwa/apple-touch-icon.png`.
- Les icones viennent de `assets/game/images-finales-gpt-image/central/island-central-01-camp.png`.

## Cache
Le service worker utilise :
- network-first pour les navigations, afin de recuperer la derniere version du jeu quand le reseau existe ;
- stale-while-revalidate pour les assets ;
- fallback cache seulement quand le reseau n'est pas disponible.

La video d'intro n'est pas precachee. Si elle manque hors-ligne, le fallback d'intro du jeu reste disponible.

## Installation
Android Chrome :
- ouvrir le site ;
- menu navigateur ;
- `Installer l'application` ou `Ajouter a l'ecran d'accueil`.

iPhone Safari :
- ouvrir le site ;
- bouton partage ;
- `Sur l'ecran d'accueil`.

## Verification rapide
- `npm run check:prod`.
- Ouvrir le build en preview.
- Verifier que `/manifest.webmanifest` repond en JSON.
- Verifier que `/sw.js` repond en JavaScript avec `Service-Worker-Allowed: /`.
- Dans un navigateur, verifier qu'un service worker est enregistre apres chargement.
