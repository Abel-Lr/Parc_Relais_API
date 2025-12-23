# Parc_Relais_API

[![en](https://img.shields.io/badge/lang-en-red.svg)](README.md)

## Description

Un tableau de bord en temps réel pour surveiller la disponibilité des places de parking dans les Parc Relais de Lyon (TCL). Ce projet utilise Vue.js pour le frontend et Nginx comme reverse proxy pour contourner proprement les problèmes CORS avec l'API Grand Lyon.

## Prérequis

Pour exécuter correctement le code, votre ordinateur doit avoir [Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/) installés avec un conteneur Nginx correctement configuré.

## Installation

1. Cloner le repo avec

   ```sh
   git clone https://github.com/Abel-Lr/Parc_Relais_API.git
   cd Parc_Relais_API
   ```

2. Créer un compte sur le [site de l'API Grand Lyon](https://data.grandlyon.com/) si ce n'est pas déjà fait.

3. Mettre à jour le fichier de configuration nginx (`./nginx/conf.d/default.conf`) avec vos identifiants API. Remplacez `<base64 email:pwd>` dans l'en-tête du proxy par vos identifiants encodés en Base64 (format : `base64(email:password)`):

   ```nginx
   server {
      listen 80;
      server_name <votre_nom_d_hote>;

      location /get-api-parc {
      	proxy_pass https://data.grandlyon.com/fr/datapusher/ws/rdata/tcl_sytral.tclparcrelaistr/all.json?maxfeatures=-1&start=1&filename=parcs-relais-reseau-transports-commun-lyonnais-disponibilites-temps-reel;

      	proxy_set_header Authorization "Basic <base64 email:pwd>";

      	proxy_hide_header Access-Control-Allow-Origin;
      	add_header Access-Control-Allow-Origin "*";

	      proxy_set_header Host data.grandlyon.com;
	      proxy_set_header X-Real-IP $remote_addr;
	      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

	      proxy_pass_header Authorization;
      }

      location / {
         root /var/www/parc-relais;
         index index.html;
	      try_files $uri $uri/ /index.html;
      }
   }
   ```

   Vous pouvez générer la chaîne Base64 en utilisant :

   ```sh
   echo -n "email:password" | base64
   ```

   ou via [ce site](https://www.base64encode.org/).

4. L'architecture du projet devrait ressembler à la suivante

```
|
├── 🐳 docker-compose.yml
├── 📁 Parc_Relais_API/
│   ├── 🐳 Dockerfile
│   ├── 🎨 App.vue
│   ├── 🎨 main.js
│   ├── 📝 style.css
│   └── 📁 src/
└── 📁 nginx/
    ├── 📁 conf.d/
    │   └── 🌐 default.conf
    └── 📁 certs/
        └── 🔐 (certificats SSL)
```

## Configuration Docker

1. Construire et lancer les conteneurs avec Docker Compose :

   ```yml
   services:
      nginx:
         image: nginx
         depends_on:
            parc-relais:
               condition: service_completed_successfully
         container_name: nginx
         restart: unless-stopped
         ports:
            - "80:80"
            - "443:443"
         volumes:
            - ./nginx/conf.d:/etc/nginx/conf.d:ro
            - ./nginx/certs:/etc/nginx/certs/ro
            - ./Parc_Relais_Api/dist:/var/www/parc-relais:ro

      parc-relais:
         build: ./Parc_Relais_Api
         container_name: parc-relais-builder
         volumes:
            - ./Parc_Relais_Api/dist:/output_dist
   ```

   ```sh
   docker compose up -d --build
   ```

2. Accédez à l'application à `http(s)://<votre_nom_d_hote>` (ou configurez votre domaine/IP en conséquence dans la config nginx).


## Crédits

Ce projet a été réalisé par [Abel-Lr](https://github.com/Abel-Lr), [Nassim Daikh](https://github.com/elkofy) & [Clément Guiton](https://github.com/ProbablyClem/)
