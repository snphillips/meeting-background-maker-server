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

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

require('dotenv').config({ path: '../.env' });
const { processingFunc } = require('./image-processing-modules/processingFunc');
const { mergeTheRotateArray } = require('./image-processing-modules/mergeTheRotateArray');
const yargs = require('yargs');

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

const tagArray = require(`./tag-arrays/${argv.array}`);

console.log("🛼 Let's GET images and turn them into backgrounds! 🛼");

// **********************************
//   Merge the giant array of objects into a flat array
// **********************************
let rotateArray = [];
let mergedRotateArray = mergeTheRotateArray(rotateArray);

async function generateImages(value) {
  console.log(
    '🔎 Looking up',
    value,
    'which is',
    tagArray.indexOf(value) + 1,
    'out of',
    tagArray.length,
    'tags'
  );

  try {
    const response = await fetch(
      `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`
    );
    if (!response.ok) throw new Error(`Cooper Hewitt API error: ${response.status}`);
    const json = await response.json();

    for (const item of json.objects) {
      // The logs will help you view the images get processed
      console.log('🏁 1) Start processing item:', item.id);
      await processingFunc(item, mergedRotateArray);
      console.log('🛑 6) Done processing item:', item.id);
      console.log('------');
    }
  } catch (error) {
    console.log('generateImages error:', error);
  }
}
/* 
Iterates over the tag array specified
by the user in the command line.
*/
tagArray.forEach(generateImages);

