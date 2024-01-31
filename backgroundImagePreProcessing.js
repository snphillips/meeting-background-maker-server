/*
***************************
This file processes batches of images, turns them into
meeting backgrounds and saves them to an AWS bucket. 

Steps:
1) Assign tagArrayToProcess (around line 37) to the string of the array
  you want to process like 'tagArray1' or 'tagArray2' etc.
2) at the end of the script, replace tagArrayTest with whichever array you are processing: tagArray1 or tagArray2 etc.
3) Run this file by running in your terminal: node backgroundImagePreProcessing
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
// into process.env
require('dotenv').config();
const axios = require('axios');
const { processingFunc } = require('./image-processing-modules/processingFunc');
const { mergeTheRotateArray } = require('./image-processing-modules/mergeTheRotateArray');

/* 
Import whichever array you are going to forEach over
replace tagArrayTest with whichever array you are going to forEach over
like tagArray1, tagArray2, tagArray3
*/
const tagArrayToProcess = 'tagArrayTest'
const tagArray = require(`./tag-arrays/`+ tagArrayToProcess);

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
  
// replace tagArrayTest with whichever array you are processing
tagArrayTest.forEach(generateImages);


