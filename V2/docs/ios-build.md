# Version iOS

## Principe
- La version web V2 reste la source du jeu.
- L'app iOS vit dans `apps/ios/`.
- Capacitor embarque le build `V2/dist` sans remplacer l'app web.

## Commandes prevues
Depuis `V2/` :

```bash
npm run build
npm run ios:sync
npm run ios:open
```

Depuis `apps/ios/` :

```bash
npm install
npx cap sync ios
npx cap open ios
```

## Contraintes iOS
- Le jeu est optimise paysage.
- L'audio WebAudio demarre seulement apres interaction utilisateur.
- La video d'intro reste `muted`, `playsInline`, et servie depuis `/assets/intro/prometheus-intro.mp4`.
- Les safe areas iPhone sont gerees par le CSS de la V2.

## Identifiants
- App name : `Prometheus Protocol`.
- App id par defaut : `com.prometheusprotocol.game`.
- Le dossier iOS ne doit pas modifier `hackathon-ancien` ni la V1 racine.
