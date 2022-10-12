
# About this Project

ESCP Survey Going Concern 2021
This repository contains all code and content for the Going Concern Survey of ESCP released in 2021.


- [About this Project](#about-this-project)
- [Project Setup](#project-setup)
  - [Dependencies](#dependencies)
  - [Dependencies to External Services](#dependencies-to-external-services)
  - [Start Developing](#start-developing)
  - [Deploy to production environment (manually)](#deploy-to-production-environment-manually)

# Project Setup
## Dependencies

In order to get this project running you have to match the following dependencies on your local machine:

- Git CLI
- NodeJS v14.16+
- NPM 6.14+

## Dependencies to External Services

Furthermore you will need to setup 

- Google Firebase

## Start Developing

Clone the repository and install dependencies.

```
git clone git@github.com:jaydioar/escp-survey-gc2021.git
cd escp-survey-gc2021
npm install
```

Start the dev server

```
npm run start
```

## Deploy to production environment (manually)

Create a minified production build

```
npm run build
```

Copy all files and sub folders inside the folder build to the root directory of your webserver.