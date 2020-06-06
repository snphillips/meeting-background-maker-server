## meeting-background-maker-server


(This repo contains the companion to Meeting Background Maker Client)

### Getting Started

Get an API key from the Cooper Hewitt Museum.
Read about the Cooper Hewitt Museum API: https://collection.cooperhewitt.org/api/
Sign up for an access token. Copy this token and save it for later. Give it delete access: https://collection.cooperhewitt.org/api/oauth2/authenticate/like-magic/

Clone this repo:

`git clone https://github.com/snphillips/meeting-background-maker-server.git`
 
Run npm to install all the dependencies:

`npm install`

Start the server:

`nodemon`

Your browser should open to http://localhost:3000/ Voila!

Test it works by visiting http://localhost:3001/searchbytag/dots. You should see array of about 70 objests. You can put any word that is a Cooper Hewitt Museum search tag after /searchbytag/
view the Cooper Hewitt Museum search tags: https://collection.cooperhewitt.org/tags/

You wont be able to do much without the server for this app running. See the repo "snphillips/meeting-background-maker-client" to get started with that.
