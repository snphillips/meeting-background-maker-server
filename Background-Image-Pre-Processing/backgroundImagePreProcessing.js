/*
***************************
This code processes batches of images, turns them into
meeting backgrounds and saves them to an AWS S3 bucket. 

Steps:
Run this file by running the below command in your terminal.
Replace the argument with whichever tag array you'd like to process.
For instance, tagArray1, tagArray2, tagArray3:

node backgroundImagePreProcessing --array tagArrayTest
***************************
*/

/*
Using process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; in your Node.js
application should be done with caution, as it disables SSL/TLS
certificate validation, which can create security vulnerabilities.
This approach should only be used for temporary debugging purposes
in a development environment, and never in a production environment.
*/
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// dotenv allows us to use environment variables from a .env file
require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const { processingFunc } = require('./image-processing-modules/processingFunc');
const { mergeTheRotateArray } = require('./image-processing-modules/mergeTheRotateArray');
// allows command line arguments
const yargs = require('yargs');

// Parsing command line arguments
const argv = yargs
  .option('array', {
    alias: 'a',
    description: 'Tag array to process',
    type: 'string',
  })
  .demandOption(['array'], 'Specify the tag array to process: node backgroundImagePreProcessing --array tagArrayTest')
  .help()
  .alias('help', 'h')
  .argv;


// Import the tag array specified by the user in the command line
const tagArray = require(`./tag-arrays/${argv.array}`);

console.log("🛼 Let's GET images and turn them into backgrounds! 🛼");

/* **********************************
  Merge the giant array of objects into a flat array
********************************** */
let rotateArray = [];
let mergedRotateArray = mergeTheRotateArray(rotateArray);
  async function generateImages(value) {

    console.log(
      '🔎 Looking up',
      value,
      'which is ',
      tagArray.indexOf(value) + 1,
      ' out of ',
      tagArray.length,
      'tags'
    );

    try {
      const response = await axios.get(`https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`);
      let data = response.data.objects;
  
      for (const item of data) {
        // The logs will help you view the images get processed
        console.log('🏁 1) Start processing item:', item.id);
        await processingFunc(item, mergedRotateArray);
        console.log('🛑 6) Done processing item:', item.id);
        console.log('------')
      }
    } catch (error) {
      console.log('generateImages error:', error);
    }
  }
  
// Iterates over the tag array specified
// by the user in the command line.
tagArray.forEach(generateImages);


