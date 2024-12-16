# Parc_Relais_API

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/Abel-Laroussi/Parc_Relais_API/blob/main/README.md)

## Description

**[WIP]**

## Prérequis

Afin de faire tourner le code, il est nécessaire d'avoir [NodeJS](https://nodejs.org/fr/download/package-manager) installé sur votre ordinateur.

## Installation

1. Cloner le répertoire git à l'aide de la commande

   ```sh
   git clone git@github.com:Abel-Laroussi/Parc_Relais_API.git
   ```

2. Installer les dépendances du projet avec la commande

   ```sh
   npm install
   ```

   ou

   ```sh
   npm i
   ```

3. Si ce n'est pas encore fait, créer un compte sur le [site des API du Grand Lyon](https://data.grandlyon.com/)

4. Créer fichier `.env` dans le dossier racine contenant les variables suivantes :

   - `API_USERNAME=LE NOM D'UTILISATEUR RENSEIGNE SUR LE COMPTE QUE VOUS AVEZ CRÉÉ`

   - `API_PW=LE MOT DE PASSE RENSEIGNE SUR LE COMPTE QUE VOUS AVEZ CRÉÉ`

   - `VITE_API_URL=https://data.grandlyon.com/fr/datapusher/ws/rdata/tcl_sytral.tclparcrelaistr/all.json?maxfeatures=-1&start=1&filename=parcs-relais-reseau-transports-commun-lyonnais-disponibilites-temps-reel # LE LIEN DE L'API POUR RECUPERER LES DONNEES DES PLACES DISPONIBLES EN TEMPS REEL DES PARC RELAIS DU GRAND LYON`

   - `VITE_COMBO=$API_USERNAME:$API_PW`

5. Lancer le projet avec la commande

   ```sh
   npm run start
   ```

6. Le site est hébergé sur l'adresse IP renseignée dans le terminal de sortie (généralement http://localhost:5173)

---

## Credits

Ce projet a été développé par [Abel Laroussi](https://github.com/Abel-Laroussi) & [Nassim Daikh](https://github.com/elkofy)
