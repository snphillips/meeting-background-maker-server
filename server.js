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
// const Jimp = require('jimp');
const _Lodash = require('lodash');

// Pure JavaScript is Unicode friendly, but it is not so
// for binary data. While dealing with TCP streams or the
// file system, it's necessary to handle octet streams.
// Node provides Buffer class which provides instances to
// store raw data similar to an array of integers but
// corresponds to a raw memory allocation outside the V8 heap.
// We're using it to store image data after it it edited by jimp
// prior to sending it to amazon.
const Buffer = require('buffer')

// import the function where we save to AWS S3 bucket
// const { saveImageToBucket } = require('./s3')

const { processingFunc } = require('./processingFunc')
const { removeRejects }  = require('./removeRejects');
// const removeListArray = require('./removeListArray');

// const { template } = require('lodash')

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
    let tempArray = response.data.tags
    tempArray = tempArray.filter(function( obj ) {
      return obj.name.length < 16;
    }); 
    
    return res.json(tempArray)
  })
  .catch(function (error) {
    console.log("axios api call catch error:", error );
  });
})



app.get('/searchbytag/:value', cors(), (req, res, error) => {

  async function searchByTag() {
    try {
      const { value } = req.params;
      const url = `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`
      const response = await axios.get(url)
      console.log("HELLO from .then", response.data.objects)
      let tempData = response.data.objects
      
      await removeRejects(tempData)
      keepArray = tempData

      await tempData.map((item) => {
        processingFunc(item, value)
      })

      data = await _Lodash.compact(tempData)

      return await res.json(data)
    
      



    } catch (error) {
       console.log("error:", error)
    }

  }
  searchByTag()
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
}).on('error:', console.error);


module.exports = app;