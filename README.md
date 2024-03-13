# Shellsea AI Copilot

https://greentechsee.safepath.no/ (ca. 8 USD gjenstår med bruk av AI chat)

## Medlemmer

- Per Christian Kvalvik
- Espen Kvernstad
- Bartek Ostrowski
- Gøran Sildnes Gedde-Dahl
- Martin Nord Flote

## OKR-er (objectives and key results)

- **Objective**: build a data set describing emergency functions related to health, safety and environmental aspects
  - **Key result**: combine different data sets to build one set that identifies location and function of bases and vessels that can assist in offshore health emergencies and oil leaks
- **Objective**: Use new and smart technology to simplify information extraction
  - **Key result**: use AI to convert free text query into a query into the assembled data set.
- **Objective**: Create a simple, accessible and readable User Interface in the event of an emergency
  - **Key result**: Use maps to simplify localization of necessary infrastructure
  - **Key result**: Have a Universal Design for the website

# Running the app using docker

GitHub Actions are used to build and push the docker images to the GitHub Container Registry on every push to the main branch.
These images are public and you can use the docker-compose.yml to run the app locally. This will run a local nginx-proxy
which exposes port 80 and 443 to the internet, and acme-companion which will automatically generate SSL certificates using
Let's Encrypt.

## Running as the single application on a server

To run the app using docker, make sure you have docker installed on your machine.

Copy the .env.template file to .env and fill in the required environment variables.

```bash
$ cp .env.template .env
```

Then run the following command to start the app:

```bash
$ docker-compose up
```

## Running multiple applications on the same server

We have separated the nginx-proxy into a single compose file in case you might want to run multiple applications on the same server.
Use the two compose configs separately for this.

Example:

```bash
docker-compose -f nginx.docker-compose.yml up -d
docker-compose -f external.docker-compose.yml up -d
```

You can then setup your other applications using similar setups as the `external.docker-compose.yml` file.

# Development

Guides to run the app locally.

## App

Powered by [React](https://reactjs.org/)

### Requirements

Dowload and install node LTS from [nodejs.org](https://nodejs.org/en/download/)

> [!NOTE]
> Make sure to change directory to the `app` folder by running `cd app`.

To install requiremnts run:

```bash
$ npm install
```

### Run locally

```bash
$ npm run dev
```

## Api

Built with [FastAPI](https://fastapi.tiangolo.com/)

### Requirements

Dowload and install python from [python.org](https://www.python.org/downloads/)

> [!NOTE]  
> Make sure to change directory to the `api` folder by running `cd api`.

To install requiremnts run:

```bash
$ pip install -r requirements.txt
```

### Run locally

To run the server locally run:

```bash
$ uvicorn app.main:app --reload
```

# Database

Run the database using docker-compose:

```bash
$ docker-compose -f docker-compose.yml run --service-ports -d database
```
