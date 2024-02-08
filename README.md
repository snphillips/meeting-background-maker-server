## meeting-background-maker-server

See project deployed here: https://meeting-background-maker.surge.sh/

_This repo contains the companion to Meeting Background Maker Client: https://github.com/snphillips/meeting-background-maker-client_

This code has two parts:
1) A script called `backgroundImagePreProcessing` that retrieves and manipulate the images from Cooper Hewitt, and saves them as backgrounds to AWS in advance
2) The back end Express server that zips user-selected backgrounds, using the package s3-zip and allows the user to save background images to thier harddrive.

### Before Getting Started

1) Get an API key from the Cooper Hewitt Museum.
- Read about the Cooper Hewitt Museum API: https://collection.cooperhewitt.org/api/
- Sign up for an access token. Copy this token and save it for later. Give it delete access: https://collection.cooperhewitt.org/api/oauth2/authenticate/like-magic/

2) This app stores meeting backgrounds to an AWS S3 bucket
- You will need to create an AWS bucket in which to store the images you'll generate.
- Learn more here: https://aws.amazon.com/s3/

### Getting Started

Clone this repo: 👯‍♀️

```
git clone https://github.com/snphillips/meeting-background-maker-server.git
```
 
Run npm to install all the dependencies: 🏗

```
npm install
```

Create a .env file to keep your secret Cooper Hewitt & AWS API tokens:

```
touch .env
```

Add `.env` to `.gitignore` so you don't push up your secret keys to github.

Paste the following code into the `.env`, but replace the values with values provided to you from Cooper Hewitt & AWS:

```
Cooper Hewitt API token
COOPER_API_TOKEN='your-token'

AWS Id & Secret
AWS_BUCKET_NAME='your-bucket-name'
AWS_BUCKET_REGION='your-region'
AWS_ACCESS_KEY_ID='your-aws-access-key-id'
AWS_SECRET_KEY='your-aws-secret-key'
```

#### How to Generate Images and Save to AWS

We generate and edit images then save them to an AWS bucket using the script `backgroundImagePreProcessing`. There are more than 200 tags (modernism, angular, textile, color) which themselves have up to 20 images. That's a lot of images to process at once, so we've broken down the tags into seven tag arrays (`tagArray1.js`, `tagArray2.js`, `tagArray3.js`). I found that by breaking up the tags into smaller groups, it's easier to debug if you encounter errors. 

Navigate into the backgroundImagePreProcessing folder.

Edit `backgroundImagePreProcessing.js` to indicate which tagArray you want to process (tagArray1, tagArray2...).
Update the const `tagArrayToProcess` and `tagArrayTest.forEach(generateImages)`.

Run the script:

```
node backgroundImagePreProcessing
```
You should see logs in your terminal as each image is processed and turned into a background then saved to AWS.
You can confirm this step worked by checking if the files are saved in your AWS S3 bucket. 

#### How to Start the Server: 🏁


```
npm run nodemon
```

Your browser should open to http://localhost:3001/ Voila! 🪄

Test it works by visiting http://localhost:3001/searchbytag/bauhaus. You should see array of about 17 objects. You can put any word that is a Cooper Hewitt Museum search tag after /searchbytag/
view the Cooper Hewitt Museum search tags: https://collection.cooperhewitt.org/tags/

You wont be able to do much without the client for this app running. See the repo "snphillips/meeting-background-maker-client" to get started with that: https://github.com/snphillips/meeting-background-maker-client

### Made With
- Node
- Express
- Cooper Hewitt Museum API
- Axios
- Jimp (server-side image processing library)
- s3-zip (saves selected objects in an aws s3 bucket as zip)
