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
app.get('/searchbytag/:value', (req, res, next) => {
  const { value } = req.params;

    axios({
      method: 'get',
      url: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=100&tag=${value}`,
      transformResponse: [(data) => {
        // transform the data
        console.log("transforming data snake jazz:", data)
        return data;
      }]
    }).then( response => {
      console.log("response length for keyword after filtering:", req.params, "is", response.data)
          // return res.json(responseItems)
      return res.json(response.data.objects)
     })


    .catch((error) => {
      console.log(error)
      res.send(`I cant' find any items.`);
    });

})




  // axios.get(`https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=100&tag=${value}`)
  // .then((response) => {
  //   console.log("response length for keyword before filtering:", req.params, "is", response.data.objects.length)
  //   // console.log("This is the response:", response.data.objects)


  //  // **********************************
  //  // Image manipulation
  //  // 1) kick out skinny images
  //  // 2) rotate portrait images
  //  // 3) check against blacklist
  //  // **********************************
  //   let responseItems = response.data.objects


  //   // =========================================
  //   // For each returned image, do the following
  //   // =========================================

  //   responseItems.forEach( (item) => {

  //     let imageUrl = item.images[0].b.url
  //     console.log("image url:", imageUrl)

  //     Jimp.read(imageUrl)

  //       .then( (meetingBackground) => {
  //         let width = meetingBackground.bitmap.width
  //         let height = meetingBackground.bitmap.height
  //         // console.log("jimp meetingBackground object: ", meetingBackground)
  //         console.log("1)", item.id, "width: ", width, "height: ", height)


  //   // =========================================

  //       function skinnyGottaGo() {

  //         if ( (height > width) && ((height / width) > 2.5) ) {
  //           console.log("2)", item.id, "Skinny PORTRAIT, REMOVE!")
  //         }
  //         else if ( (width > height) && ((width / height) > 2.5) ) {
  //           _Lodash.remove(responseItems, item)
  //           console.log("2)", item.id, "Skinny LANDSCAPE, REMOVE!")
  //         }
  //         else {
  //           console.log("2)", item.id, "Not skinny. It can stay.")
  //         }

  //       }
  //       skinnyGottaGo()


  //   // =========================================

  //       function rotatePortrait() {

  //         if (height > width) {
  //           console.log("3)", item.id, "PORTRAIT image, ROTATE 90 degrees.")
  //           return meetingBackground
  //           .rotate( 90 )
  //           // .write("../meeting-background-maker-client/public/meeting-backgrounds/jimp-rotate.jpg")
  //         }
  //         else if (width > height) {
  //           console.log("3)", item.id, "LANDSCAPE image. Leave as is.")
  //         } else {
  //           console.log("3)", item.id, "SQUARE image. Leave as is.")

  //         }
  //       }
  //       rotatePortrait()

  //   // =========================================

  //     })


  //   .catch(err => {
  //     console.error(err);
  //   });


  //   })



    // =========================================
    // This is what you're sending to client
    // Problems:
    // 1) you're sending this BEFORE the image filtering happens
    // 2) You're not sending the image rotation data
    // =========================================
//     console.log("4) responseItems.length after filtering", responseItems.length)
//     return res.json(responseItems)
//     // return res.json(response.data.objects)
//   })

//   .catch((error) => {
//     console.log(error)
//     res.send(`I cant' find any items.`);
//   });
// });




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
