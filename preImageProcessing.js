process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// so we can use environment variables from a .env file
// into process.env
require('dotenv').config();

const express = require('express');
const app = express();
const axios = require('axios');

// const { mergeTheRotateArray }  = require('./modules/mergeTheRotateArray')
const { processingFunc } = require('./modules/processingFunc');

// import whichever array you are going to forEach over
// replace tagArrayTest with whichever array you are going to forEach over
// like tagArray1, tagArray2, tagArray3
const tagArray = require('./tag-arrays/tagArrayTest');

// set the port, either from an environmental variable or manually
const port = process.env.PORT || 3002;

console.log("🛼 Let's GET & process images! 🛼");

app.get('/', (req, res) => {
  res.send(`Hello world, let's pre-process some meeting backgrounds.`);
});

// **********************************
// Merge the giant array of objects into a flat array
// **********************************
let rotateArray = [];
let mergedRotateArray = [];

function mergeTheRotateArray() {
  // console.log("rotateImageArray:", rotateImageArray)

  /* Create master rotate array by 
    pushing all the arrays together
    then removing the extra array brackets */
  rotateImageArray.map((listItem) => {
    rotateArray.push(listItem.rotateListId);
    mergedRotateArray = [].concat.apply([], rotateArray);
  });
  /* Remove duplicates from mergedRotateArray
    The Set object lets you store unique values 
    of any type, whether primitive values or object references. */
  mergedRotateArray = [...new Set(mergedRotateArray)];
  // console.log("👙 mergedRotateArray:", mergedRotateArray);
  // return mergedRotateArray;
}

mergeTheRotateArray();

// **********************************
// For each search term in the tagArray,
// get a list of items from the museum,
// the process all the items with processingFunc
// **********************************
  function generateImages(value) {
    // console.log("🪲 mergedRotateArray:", mergedRotateArray);
    console.log(
      'Looking up',
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
      // console.log("🦈 mergedRotateArray:", mergedRotateArray);
      let data = response.data.objects;

      // Do lots of stuff to process each image
      data.map((item) => {
        processingFunc(item, mergedRotateArray);
      });
    })
    .catch(function (error) {
      console.log('searchbyvalue error:', error);
    });
}

// replace tagArrayTest with whichever array you are processing
tagArrayTest.forEach(generateImages);

// **********************************
// Error Handlers
// **********************************
app.use((err, req, res, next) => {
  res.json(err);
  res.status(500).send('Oh no a 500 error.');
});

app.use((req, res, next) => {
  res.status(404).send(`Oh no a 404 error. Resource not available.`);
});

// **********************************
// Port
// **********************************
app
  .listen(port, () => {
    console.log(
      `Let's get some meeting backgrounds! Listening on port: ${port}, in ${app.get('env')} mode.`
    );
  })
  .on('port error:', console.error);

module.exports = app;
