# Deploiement VPS

Ce projet est une app Vite statique. Le deploiement le plus simple est :

1. Construire l'image Docker de l'app.
2. Servir `dist` via Nginx.
3. Mettre Traefik devant pour rediriger HTTP vers HTTPS.
4. Demander un certificat Let's Encrypt directement pour l'IP publique `193.203.190.2`.

## Variables

Copier l'exemple :

```sh
cp .env.example .env
```

`PUBLIC_HOST` doit rester l'IP publique tant que tu n'as pas de domaine :

```sh
PUBLIC_HOST=193.203.190.2
```

`ACME_EMAIL` doit etre un email que tu consultes vraiment. Il sert au compte Let's Encrypt et aux alertes importantes. Il n'a pas besoin d'etre lie a un domaine. Par exemple, tu peux mettre ton email perso.

```sh
ACME_EMAIL=ton-email@example.com
```

## Lancer sur le VPS

Si le VPS n'a aucun reverse-proxy existant, depuis le dossier du projet sur le VPS :

```sh
docker compose up -d --build
docker compose logs -f traefik game
```

Le jeu devrait ensuite repondre sur :

```text
https://193.203.190.2/
```

## Envoyer les fichiers depuis ta machine

Quand l'acces SSH fonctionne :

```sh
ssh -i ~/.ssh/struct20022_deploy -o ClearAllForwardings=yes deploy@193.203.190.2 'mkdir -p ~/prometheus-protocol'
rsync -az --delete -e 'ssh -i ~/.ssh/struct20022_deploy -o ClearAllForwardings=yes' --exclude node_modules --exclude dist --exclude .git ./ deploy@193.203.190.2:~/prometheus-protocol/
ssh -i ~/.ssh/struct20022_deploy -o ClearAllForwardings=yes deploy@193.203.190.2 'cd ~/prometheus-protocol && cp -n .env.example .env && docker compose up -d --build'
```

Pense a modifier `~/prometheus-protocol/.env` sur le VPS avec ton vrai `ACME_EMAIL` avant le premier lancement en production.

## Lancer derriere le Caddy existant du VPS

Sur `193.203.190.2`, un conteneur Caddy occupe deja les ports `80` et `443`.
Dans ce cas, il ne faut pas lancer le Traefik de `compose.yml`.
On branche seulement le jeu au reseau Docker `edge` :

```sh
cd ~/prometheus-protocol
docker compose -f deploy/compose.caddy.yml -p prometheus-game up -d --build
```

Puis Caddy doit router `193.203.190.2` vers le conteneur `prometheus-game:80`.
La forme utilisee sur le VPS existant est :

```caddyfile
{
	email hugoprigent9@gmail.com
	default_sni 193.203.190.2
}

:443, 193.203.190.2 {
	tls {
		issuer acme {
			profile shortlived
		}
	}
	reverse_proxy prometheus-game:80
}
```

Le bloc `:443, 193.203.190.2` doit rester avant les domaines existants dans le Caddyfile. Caddy trie ensuite les routes par host dans sa config JSON, donc les domaines deja en prod gardent la priorite et l'IP sert le jeu.

## Notes HTTPS sans domaine

Let's Encrypt accepte les certificats pour IP publique avec le profil `shortlived`, valide 160 heures. La config Traefik utilise donc :

- `acme.profile=shortlived`
- `acme.certificatesduration=160`
- `acme.disablecommonname=true`
- le challenge TLS-ALPN sur le port `443`

Les ports `80` et `443` doivent etre ouverts sur le VPS.
