# Parc_Relais_API

[![en](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/Abel-Laroussi/Parc_Relais_API/blob/main/README-FR.md)

## Description

**[WIP]**

## Prerequisites

To run the code properly, your computer needs to have [NodeJS](https://nodejs.org/fr/download/package-manager) installed.

## Installation

1. Clone the repository with

   ```sh
   git clone git@github.com:Abel-Laroussi/Parc_Relais_API.git
   ```

2. Install project dependancies with

   ```sh
   npm install
   ```

   or

   ```sh
   npm i
   ```

3. If not done, create an account on the [Grand Lyon API Website](https://data.grandlyon.com/)

4. Create a `.env` file containing at the root directory the following variables :

   - `API_USERNAME=THE USERNAME OF THE ACCOUNT YOU CREATED`

   - `API_PW=THE PASSWORD OF THE ACCOUNT YOU CREATED`

   - `VITE_API_URL=https://data.grandlyon.com/fr/datapusher/ws/rdata/tcl_sytral.tclparcrelaistr/all.json?maxfeatures=-1&start=1&filename=parcs-relais-reseau-transports-commun-lyonnais-disponibilites-temps-reel # THE API LINK FOR THE LIVE NUMBER OF REMAINING PARKING SLOTS IN LYON 'PARC RELAIS'`

   - `VITE_COMBO=$API_USERNAME:$API_PW`

5. Run the project with

    ```sh
    npm run start
    ```

6. The website will be hosted on the IP displayed in the terminal (usually http://localhost:5173)

## Credits

This project was made by [Abel Laroussi](https://github.com/Abel-Laroussi) & [Nassim Daikh](https://github.com/elkofy)
