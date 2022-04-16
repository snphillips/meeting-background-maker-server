// so we can use environment variables from a .env file
// into process.env
require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors())

// Body-parser captures data coming via a form
const bodyParser = require('body-parser');

const axios = require('axios');
const s3Zip = require('s3-zip');
const _Lodash = require('lodash');


/* Pure JavaScript is Unicode friendly, but not so
for binary data. While dealing with TCP streams or the
file system, it's necessary to handle octet streams.
Node provides Buffer class which provides instances to
store raw data similar to an array of integers but
corresponds to a raw memory allocation outside the V8 heap.
We're using it to store image data after it it edited by jimp
prior to sending it to amazon. */
const Buffer = require('buffer')

const { processingFunc } = require('./processingFunc');
// const { removeRejects }  = require('./removeRejects');
// const removeListArray = require('./removeListArray');


// set the port, either from an environmental variable or manually
const port = process.env.PORT || 3001;

// **********************************
// index route
// **********************************
app.get('/', (req, res, next) => {
  res.send(`Hello world, let's make some meeting backgrounds.`)
})

// **********************************
// Gets all the search tags 
// (to create the dropdown menu)
// **********************************
app.get('/alltags/', (req, res, error) => {
  let url = `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.tags.getAll&access_token=${process.env.COOPER_API_TOKEN}&sort=count&sort_order=desc&page=1&per_page=200`
  axios.get(url)
  .then((response) => {
    // Names that are too long mess up the dropdown menu UI
    // Here we filter the array of tag words, and keep the
    // ones that are shorter than 16 characters.
    let tempArray = response.data.tags
    tempArray = tempArray.filter(function( obj ) {
      return obj.name.length < 16;
    }); 
    
    return res.json(tempArray)
  })
  .catch(function (error) {
    console.log('alltags error:', error);
  });
})

// **********************************
// Gets all the items a value that matches keyword
// **********************************
app.get('/searchbytag/:value', cors(), (req, res, error) => {

  const { value } = req.params;

  axios({
    method: 'get',
    url: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`,
  }).then( (response) => {
      // console.log("HELLO from .then", response.data.objects)
      
      let tempData = response.data.objects

      // Mapping over all the returned images and processing
      // them all through processingFunc (find this big function
      // in processingFunc.js)
      tempData.map((item) => {
        processingFunc(item, value)
      })

      // Remove null values
      // processingFunc may have created null values if it
      // encountered. This removes them from the array. 
      data = _Lodash.compact(tempData)

      // return data  
      return res.json(data)

  }).then(() => {
      setTimeout( () => {
        console.log("HELLO FROM FIRST .THEN")
      }, 1000);
  }).then(() => {
    setTimeout( () => {
      console.log("HELLO FROM second .THEN")
    }, 1500);
  }).then(() => {
    setTimeout( () => {
      console.log("HELLO FROM third .THEN")
    }, 2000);
  }).catch(function (error) {
    console.log("searchbytag error:", error);
  });
})


// **********************************
// zip selected files in aws
// note: using npm package s3-zip
// https://github.com/orangewise/s3-zip
// **********************************
app.get('/download', (req, res) => {
  
  const awsBucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_BUCKET_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_KEY;
  const S3 = require('aws-sdk/clients/s3');
  
  const s3Bucket = new S3({
    region, 
    accessKeyId,
    secretAccessKey
  })
  
  console.log("🗜🗜🗜🗜 s3zip req.query:", req.query )
  
  // The list of image jpegs comes from the client
  // as an object called eq.query.
  // We use Object.values() to put the values into
  // an array called jpegFiles, which we pass into
  // s3Zip
  const jpegFiles = Object.values(req.query);
  // console.log("jpegFiles:", jpegFiles)
  const folder = 'meeting-backgrounds/';
  
  s3Zip
    .archive({ 
      s3: s3Bucket,
      region: region, 
      bucket: awsBucketName,
      preserveFolderStructure: true,
    }, folder, jpegFiles)
    .pipe(res.attachment())

})


// **********************************
// Error Handlers
// **********************************
app.use((err, req, res, next) => {
  res.json(err);
  res.status(500).send('Oh no a 500 error.')
});

app.use((req, res, next) => {
  res.status(404).send(`Oh no a 404 error. I can't find that.`)
})


app.use(bodyParser.json());

// **********************************
// Middleware that adds a X-Response-Time
// header to responses.
// **********************************
// app.use(responseTime());

// **********************************
// Port
// **********************************
app.listen(port, () => {
  console.log(`Let's get some meeting backgrounds! Listening on port: ${port}, in ${app.get('env')} mode.`);
}).on('port error:', console.error);


module.exports = app;
