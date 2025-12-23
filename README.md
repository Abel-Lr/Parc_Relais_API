# Parc_Relais_API

[![en](https://img.shields.io/badge/lang-fr-blue.svg)](README-FR.md)

## Description

A real-time dashboard to monitor parking space availability in Lyon's Parc Relais (TCL). This project uses Vue.js for the frontend and Nginx as a reverse proxy to securely bypass CORS issues with the Grand Lyon API.

## Prerequisites

To run the code properly, your computer needs to have [Docker](https://docs.docker.com/get-docker/), [Docker Compose](https://docs.docker.com/compose/install/) installed along with a properly configured Nginx container.

## Installation

1. Clone the repository with

   ```sh
   git clone https://github.com/Abel-Lr/Parc_Relais_API.git
   cd Parc_Relais_API
   ```

2. Create an account on the [Grand Lyon API Website](https://data.grandlyon.com/) if you haven't already.

3. Update the nginx configuration file (`./nginx/conf.d/default.conf`) with your API credentials. Replace `<base64 email:pwd>` in the proxy header with your Base64-encoded credentials (format: `base64(email:password)`):

   ```nginx
   server {
      listen 80;
      server_name <your_hostname>;

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

   You can generate the Base64 string using:

   ```sh
   echo -n "email:password" | base64
   ```

   or via [this website](https://www.base64encode.org/).

4. You should have this architecture at this moment

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
        └── 🔐 (SSL certificates)
```

## Docker Configuration
1. Build and start the containers with Docker Compose:

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

2. Access the application at `http(s)://<your_hostname>` (or configure your domain/IP accordingly in the nginx config).


## Credits

This project was made by [Abel-Lr](https://github.com/Abel-Lr), [Nassim Daikh](https://github.com/elkofy) & [Clément Guiton](https://github.com/ProbablyClem/)
