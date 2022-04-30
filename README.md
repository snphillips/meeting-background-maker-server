## meeting-background-maker-server

See project deployed here: https://meeting-background-maker.surge.sh/

_This repo contains the companion to Meeting Background Maker Client: https://github.com/snphillips/meeting-background-maker-client_

### Before Getting Started

1) Get an API key from the Cooper Hewitt Museum.
- Read about the Cooper Hewitt Museum API: https://collection.cooperhewitt.org/api/
- Sign up for an access token. Copy this token and save it for later. Give it delete access: https://collection.cooperhewitt.org/api/oauth2/authenticate/like-magic/

2) This app stoes meeting backgrounds to an AWS S3 bucket
- If you're new to AWS, working with AWS is a _whole thing_.
- Learn more here: https://aws.amazon.com/s3/

### Getting Started

Clone this repo: 👯‍♀️

`git clone https://github.com/snphillips/meeting-background-maker-server.git`
 
Run npm to install all the dependencies: 🏗

`npm install`

Create a .env file to keep your secret Cooper Hewitt & AWS API tokens:

`touch .env`

Paste the following code into the .env, but replace the values with values provided to you from Cooper Hewitt & AWS:

`Cooper Hewitt API token
COOPER_API_TOKEN='your-token'

AWS Id & Secret
AWS_BUCKET_NAME='your-bucket-name'
AWS_BUCKET_REGION='your-region'
AWS_ACCESS_KEY_ID='your-aws-access-key-id'
AWS_SECRET_KEY='your-aws-secret-key'`


Start the server: 🏁

`npm run nodemon`

Your browser should open to http://localhost:3001/ Voila! 🪄

Test it works by visiting http://localhost:3001/searchbytag/bauhaus. You should see array of about 17 objects. You can put any word that is a Cooper Hewitt Museum search tag after /searchbytag/
view the Cooper Hewitt Museum search tags: https://collection.cooperhewitt.org/tags/

You wont be able to do much without the client for this app running. See the repo "snphillips/meeting-background-maker-client" to get started with that.

### Made With
- Node
- Express
- Cooper Hewitt Museum API
- Axios
- Jimp (server-side image processing library)
- s3-zip (saves selected objects in an aws s3 bucket as zip)
