## Beskrivning
Det här projektet är en fullstack-applikation med en backend byggd i Node.js/Express och en react frontend. Applikationen hanterar recept och användarautentisering med GitHub OAuth via Passport.js.

## Vilket problem löser koden?
Den löser problemet att läsa och hantera receptdata med användarautentisering och sessionhantering.

## Installation

### klona
git clone 
cd backend

## Installera alla dependencies
npm install

## ENV fil skapa i backend mappen
MONGODB_URI=din_mongodb_uri
SPOONACULAR_API_KEY=spoonacular_api_nyckel
GITHUB_CLIENT_ID=github_client_id
GITHUB_CLIENT_SECRET=github_client_secret

## Övrig dokumentation
https://expressjs.com/
https://www.passportjs.org/packages/passport-github2/

## Starta backend koden 
npm start

## Starta front enden
npm run dev

## Användning exempel
Hämta alla recept http://localhost:3000/api/recipes
Använd tex insomnia.

/Svea
