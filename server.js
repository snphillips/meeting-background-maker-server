// so we can use environment variables from a .env file
// into process.env
require('dotenv').config()

//import express
const express = require('express');
// initialize the app
const app = express();

// const logger = require('morgan');

const axios = require('axios');

const Jimp = require('jimp');

const async = require("async");

const _Lodash = require('lodash');


// **********************************
// CORS
// npm package to allow cross origin resource sharing
// **********************************
const cors = require('cors')
app.use(cors())

// Body-parser captures data coming via a form.
// Allows our forms to work)
const bodyParser = require('body-parser');


// set the port, either from an environmental variable or manually
const port = process.env.PORT || 3001;



// **********************************
// index route
// **********************************
app.get('/', (req, res, next) => {
  res.send(`Hello world, let's make some meeting backgroundz.`)
})


// **********************************
// Get All - Search by Tag
// TODO: not using this yet
// **********************************
let values = ["accountants", "wallpaper", "abstract", "textile", "modernism", "textile design", "sidewall", "wallcovering", "architectural-drawing"]



// The search is no longer connected to
app.get('/searchbytag/:value', (req, res, error) => {


  const { value } = req.params;

  axios({
    method: 'get',
    url: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=100&tag=${value}`
  })
  .then( (response) => {
    console.log("response length for keyword :", req.params, "is", (response.data.objects).length)
    console.log("response:", response.data.objects)

    let responseItems = response.data.objects

    // For each item in the response, do processsingFunc()
    responseItems.map(  (item) => {
      processingFunc( item )
    }),

    console.log("DONE")
    // _Lodash.compact() removes null values that were put in there
    // by processingFunc, by removeRejectList & removeSkinnyImages
    return res.json(_Lodash.compact(responseItems))
  })
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });



// "item" is every item in responseItems, which we're mapping over
const processingFunc = (item) => {

    // The location of where we're saving the image once it's been processed.
    // Storing this in the json will make it easier to find on the client
    function addLocalImageLocation() {

      item["imgFileLocation"] = './meeting-backgrounds/' + value + '/' + item.id + '.jpg';
      console.log("snake jazz", item.imgFileLocation, "value is: ", value )
    }
    addLocalImageLocation()


    function removeRejectList() {
      console.log("remove from rejection list")
      // TODO: write this function that skips over any image which appears in a list
      // ...a list which does not yet exist
    }
    removeRejectList()

    // =========================================

      let imageUrl = item.images[0].b.url
      // console.log("image url:", imageUrl)

      Jimp.read(imageUrl)

        .then( (meetingBackground) => {
          let width = meetingBackground.bitmap.width
          let height = meetingBackground.bitmap.height
          // console.log("jimp meetingBackground object: ", meetingBackground)
          console.log("1) processing: ", item.id, "width: ", width, "height: ", height)


    // =========================================
        // If the image is too skinny, turn it to null
        function removeSkinnyImages() {

          if ( (height > width) && ((height / width) > 2 ) ) {
            console.log("2)", item.id, "Skinny PORTRAIT, REMOVE!")
            item = null
            // _Lodash.remove(responseItems, item)
          }
          else if ( (width > height) && ((width / height) > 2 ) ) {
            console.log("2)", item.id, "Skinny LANDSCAPE, REMOVE!")
            item = null

          }
          else {
            console.log("2)", item.id, "Not skinny. It can stay.")
          }

        }
        removeSkinnyImages()


    // =========================================

        function rotatePortrait() {

          // our array now has null values that have neigther height or width.
          // if our function encounters one of those, return out of the function.
          if (item === null) {
            return
          } else if (height > width) {
            console.log("3)", item.id, "PORTRAIT image, ROTATE 90 degrees.")
            meetingBackground.rotate( 90 )
            .quality(70)
            .write("../meeting-background-maker-client/public/meeting-backgrounds/" + value + "/" + item.id + ".jpg")
          } else if (width > height) {
            console.log("3)", item.id, "LANDSCAPE image. Leave as is.")
          } else {
            console.log("3)", item.id, "SQUARE image. Leave as is.")

          }
        }

        rotatePortrait()
    // =========================================



      })

      .catch(err => {
        console.error(err);
      });


    };

    // =========================================


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
}).on('error', console.error);


module.exports = app;
