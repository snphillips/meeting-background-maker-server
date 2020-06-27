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
// **********************************
let values = ['accountants', 'spectrum', 'carpet design', 'wallpaper']



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
    // _Lodash.compact() removes null values
    return res.json(_Lodash.compact(responseItems))
  });



// "item" is every item in responseItems, which we're mapping over
const processingFunc = (item) => {


    function removeRejectList() {
      // console.log("remove from rejection list")
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

        function skinnyGottaGo() {

          if ( (height > width) && ((height / width) > 2.5) ) {
            console.log("2)", item.id, "Skinny PORTRAIT, REMOVE!")
            // item = null
            _Lodash.remove(responseItems, item)
          }
          else if ( (width > height) && ((width / height) > 2.5) ) {
            console.log("2)", item.id, "Skinny LANDSCAPE, REMOVE!")
            item = null

          }
          else {
            console.log("2)", item.id, "Not skinny. It can stay.", value)
             meetingBackground
            // TODO: why does writing to the folder cause the app to no longer return the response to the client?
            // The response arrives to client, but the client rerenders
            // UPDATE: this stopped for some reason
            // .write("../meeting-background-maker-client/public/meeting-backgrounds/allBackgrounds/" + item.id)
            .write("../meeting-background-maker-client/public/meeting-backgrounds/" + value + "/" + item.id)
          }

        }
        skinnyGottaGo()


    // =========================================

        function rotatePortrait() {

          // our array now has null values that have neigther height or width.
          // if our function encounters one of those, return out of the function.
          if (item === null) {
            return
          } else if (height > width) {
            console.log("3)", item.id, "PORTRAIT image, ROTATE 90 degrees.")
            meetingBackground.rotate( 90 )
            // TODO: why does writing to the folder cause the app to no longer return the response to the client?
            // The response arrives to client, but the client rerenders
            // .write("../meeting-background-maker-client/public/meeting-backgrounds/allBackgrounds/" + item.id)
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
