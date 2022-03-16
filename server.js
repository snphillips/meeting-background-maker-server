// so we can use environment variables from a .env file
// into process.env
require('dotenv').config()

//import express
const express = require('express')

const cors = require('cors')

// initialize the app
const app = express()

const axios = require('axios')
const Jimp = require('jimp')
const async = require("async")
const _Lodash = require('lodash')

app.use(cors())

const removeListArray = require('./removeListArray');

// Body-parser captures data coming via a form.
// Allows our forms to work)
const bodyParser = require('body-parser');
const { template } = require('lodash')

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
// TODO: not using this yet. This is so in theory you can 
// populate this in advance (reddis?) so we're not hitting
// the api endpoit to get the same data
// THIS LIST IS OUT OF DATE!!!
// **********************************
let values = [
  "accountants", 
  "wallpaper",
   "abstract",
   "textile",
   "modernism",
   "textile design",
   "sidewall",
   "wallcovering",
   "architectural-drawing"
  ]

app.get('/searchbytag/:value', (req, res, error) => {

  const { value } = req.params;

  axios({
    method: 'get',
    url: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`,
    transformResponse:[ (data) => {
      console.log("begin transformResponse")
      // Do whatever you want to transform the data
      // before sending it to client
      let parsedData = JSON.parse(data);
      let tempData = parsedData.objects
      // console.log("DONE tempData:", tempData)
      
      // ===========================
      // Remove Rejects
      // For various reasons we don't want certain images to display 
      // like they suck, or are miscategorized).
      // This function compares images to removeListArray
      // ===========================
      function removeRejectList() {
        let rejectsArray = [];
        let mergedRejectsArray = [];
        
        // 1) create master reject array
        removeListArray.map( (listItem) => {
          // smush all the arrays together
          rejectsArray.push(listItem.removalListId)
          // now remove the extra array brackets
          mergedRejectsArray = [].concat.apply([], rejectsArray);
        })
        
        // 2) nested loop over both arrays to look for matches in the reject array
        // We're making a new temporary array called keepArray, where we place
        // images we want to keep
        let keepArray = tempData;
        for (let i = 0; i < tempData.length - 1; i++) {
          console.log("tempData[i].id", tempData[i].id)
          for (let j = 0; j < mergedRejectsArray.length; j++) {
            if (tempData[i].id === mergedRejectsArray[j]) {
              console.log("a match. DESTROY", tempData[i].id)
              _Lodash.remove(keepArray, function(item) {
                return item === tempData[i];
              });
              console.log("keepArray.length:", keepArray.length)
            }
          }
        }
      }
      removeRejectList()
      keepArray = tempData
      
      
      tempData.map((item) => {
        processingFunc(item)
      })
      
      // _Lodash.compact() removes falsey (null, false, NaN) values
      // that were put in there by processingFunc,
      // by removeRejectList & removeSkinnyImages
      console.log("boop:", tempData.length)
      data = _Lodash.compact(tempData)
      console.log("snoot:", data.length)


      data = tempData
      // return data;
      return tempData;
    }] 
    // ********************************************
    // *******END TRANSFORM RESPONSE **************
    // ********************************************
    // ********************************************
  }).then( (response) => {
    // console.log("response.data:", response.data)
    // console.log("response length for keyword :", req.params, "is", (response.data.objects).length)
    // console.log("response.data:", response.data)

    // let responseItems = response.data.objects
    // sarah: remember transformResponse changes the data type
    let responseItems = response.data

    // _Lodash.compact() removes null values that were put in there
    // by processingFunc, by removeRejectList & removeSkinnyImages
    return res.json(_Lodash.compact(responseItems))
    // return res.json(responseItems)

  }).catch(function (error) {
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

// =====================================
// Mondo function where we do all kinds of stuff to the 
// returned images  
// "item" is every item in responseItems, which we're mapping over
// =====================================  
const processingFunc = (item) => {

    // =========================================
      // TODO: add an error catch
      let imageUrl = item.images[0].b.url
      // console.log("snakejazz image.id:", item.id)
      // console.log("snakejazz item.images[0].b.url:", item.id , item.images[0].b.url)

      Jimp.read(imageUrl).then( (meetingBackground) => {
          let width = meetingBackground.bitmap.width
          let height = meetingBackground.bitmap.height
          // console.log("jimp meetingBackground object: ", meetingBackground)
          console.log("1) processing: ", item.id, "width: ", width, "height: ", height)


    // =========================================
        // If the image is too skinny to be an appropriate background, 
        // turn it to null (we're going to get rid of it)
        function makeSkinnyImagesNull() {

          if (item === null) {
            return
          } else if ( (height > width) && ((height / width) > 2 ) ) {
            console.log("2)", item.id, "Skinny PORTRAIT, REMOVE!")
            item = null
            console.log("item should be null:", item)
            // _Lodash.remove(tempData, function(image) {
            //   console.log("Skinny. Removing:", item.id)
            //   return image === item;
            // });
          }
          else if ( (width > height) && ((width / height) > 2 ) ) {
            console.log("2)", item.id, "Skinny LANDSCAPE, REMOVE!")
            item = null
            console.log("item should be null:", item)

          }
          else {
            console.log("2)", item.id, "Not skinny. It can stay.")
          }

        }
        makeSkinnyImagesNull()
    // ========================================

        // function rotatePortrait() {
        //   if (item === null) {
        //     return
        //   } else if (height > width) {
        //     console.log("3)", item.id, "PORTRAIT image, ROTATE 90 degrees.")
        //     meetingBackground
        //       .quality(60)
        //       .rotate(90)
        //     // Sarah, the below line is critical but commented out while troubleshooting
        //     .write("../meeting-background-maker-client/public/meeting-backgrounds/" + value + "/" + item.id + ".jpg")
        //   } else if (width > height) {
        //     meetingBackground
        //       .quality(60)
        //       .write("../meeting-background-maker-client/public/meeting-backgrounds/" + value + "/" + item.id + ".jpg")
        //     console.log("3)", item.id, "LANDSCAPE image. Leave as is.")
        //   } else {
        //     meetingBackground
        //       .quality(60)
        //       .write("../meeting-background-maker-client/public/meeting-backgrounds/" + value + "/" + item.id + ".jpg")
        //     console.log("3)", item.id, "SQUARE image. Leave as is.")

        //   }
        // }

        // rotatePortrait()
    // =========================================
    // ========================================

        function imageManipulation() {
          if (item === null) {
            return
          } else if (height > width) {
            // Portrait
            console.log("3)", item.id, "PORTRAIT image.")
            meetingBackground
              .quality(60)
              .rotate(90)
              .resize(Jimp.AUTO, 576) // resize( w, h[, mode] )
              .background(0xFFFFFFFF)
              .contain(1024, 576) // .contain( w, h[, alignBits || mode, mode] );
              // Sarah, the below line is critical but commented out while troubleshooting
              .write("../meeting-background-maker-client/public/meeting-backgrounds/" + value + "/" + item.id + ".jpg")
            } else if (width > height) {
              // Landscape
              meetingBackground
              .quality(60)
              .autocrop(false)
              .rgba(false)
              .cover(1024,576) // .cover( w, h[, alignBits || mode, mode] );
              .write("../meeting-background-maker-client/public/meeting-backgrounds/" + value + "/" + item.id + ".jpg")
            console.log("3)", item.id, "LANDSCAPE image.")
          } else {
            meetingBackground
              .quality(60)
              .autocrop(false)
              .write("../meeting-background-maker-client/public/meeting-backgrounds/" + value + "/" + item.id + ".jpg")
            console.log("3)", item.id, "SQUARE image. Leave as is.")

          }
        }

        imageManipulation()
    // =========================================

    
      }).catch(err => {
        console.error("Jimp-related server error:", err);
      });

    // The location of where we're saving the image once it's been processed.
    // Storing this in the json will make it easier to find on the client
    function addLocalImageLocation() {
      item["imgFileLocation"] = './meeting-backgrounds/' + value + '/' + item.id + '.jpg';
    }
    addLocalImageLocation()


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
