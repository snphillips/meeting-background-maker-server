/* 
TODO: fill out these instructions 
This file processes batches of images, turns them into
meeting backgrounds and saves them to AWS 

Steps:
1) change tagArrayToProcess to the string of the array you want to process like 'tagArray1' or 'tagArray2' etc.
2) at the end of the script, replace tagArrayTest with whichever array you are processing: tagArray1 or tagArray2 etc.
3) Run this file by running: node preImageProcessing
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

const { processingFunc } = require('./modules/processingFunc');

/* 
Import whichever array you are going to forEach over
replace tagArrayTest with whichever array you are going to forEach over
like tagArray1, tagArray2, tagArray3
*/
const tagArrayToProcess = 'tagArrayTest'
const tagArray = require(`./tag-arrays/`+ tagArrayToProcess);


console.log("🛼 Let's GET & process images! 🛼");


// **********************************
// Merge the giant array of objects into a flat array
// **********************************
const { mergeTheRotateArray } = require('./modules/mergeTheRotateArray');
let rotateArray = [];
let mergedRotateArray = mergeTheRotateArray(rotateArray);


/* **********************************
  For each search term in the tagArray,
  get a list of items from the museum,
  the process all the items with processingFunc
  ********************************** */
  function generateImages(value) {
    console.log(
      '🔎 Looking up',
      value,
      'which is ',
      tagArray.indexOf(value) + 1,
      ' out of ',
      tagArray.length,
      'tags'
    );

  axios({
    method: 'get',
    url: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`,
  })
    .then((response) => {
      let data = response.data.objects;
      // console.log("🦈 data.data.id:", data.data.id);

      // Do lots of stuff to process each image
      data.map((item) => {
        console.log('🏁starting to process item:', item.id)
        processingFunc(item, mergedRotateArray);
        console.log('🛑 done processing item:', item.id)
      });
    })
    .catch(function (error) {
      console.log('searchbyvalue error:', error);
    });
}

// replace tagArrayTest with whichever array you are processing
tagArrayTest.forEach(generateImages);
