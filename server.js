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

const { processingFunc } = require('./jimpFuncs')

const removeListArray = require('./removeListArray');

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
    // return res.json(_Lodash.compact(response.data.tags))
    return res.json(response.data.tags)
  })
  .catch(function (error) {
    console.log("axios api call catch error:", error );
  });
})



app.get('/searchbytag/:value', cors(), (req, res, error) => {

  const { value } = req.params;

  axios({
    method: 'get',
    url: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`,
  }).then( (response) => {
      console.log("HELLO from .then", response.data.objects)
      let tempData = response.data.objects
      
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
        
        // 2) nested loop over both arrays to look for matches in the
        // reject array we're making a new temporary array called
        // keepArray, where we place images we want to keep
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
        processingFunc(item, value)
      })

      data = _Lodash.compact(tempData)

    return res.json(data)

  }).catch(function (error) {
    if (error.response) {
      console.log("error.response.data:", error.response.data);
      console.log("error.response.status:", error.response.status);
      console.log("error.response.headers:", error.response.headers);
    } else if (error.request) {
      console.log("error.request:", error.request);
    } else {
      console.log('Error:', error.message);
    }
    console.log("error.config:", error.config);
  });

// // =====================================
// // The big function where we do all kinds of stuff to the 
// // returned images  
// // "item" is every item in responseItems, which we're mapping over
// // =====================================  
// const processingFunc = (item) => {

//       // TODO: add an error catch
//       let imageUrl = item.images[0].b.url

//       Jimp.read(imageUrl).then( (meetingBackground) => {
        
//           let width = meetingBackground.bitmap.width
//           let height = meetingBackground.bitmap.height
//           let aspectRatio = width/height
//           // console.log("jimp meetingBackground object: ", meetingBackground)
//           console.log("processing: ", item.id, "width: ", width, "height: ", height)

//         // =========================================
//         // If the image is too skinny to be an appropriate background, 
//         // turn it to null (we're going to get rid of it)
//         function removeSkinnyImages() {

//           if ( (height > width) && ((height / width) > 2 ) ) {
//             console.log('🧹', item.id, "Skinny PORTRAIT, REMOVE!")
//             item = null
//             // _Lodash.remove(responseItems, item)
//           } else if ( (width > height) && ((width / height) > 2 ) ) {
//             console.log('🚣‍♀️', item.id, "Skinny LANDSCAPE, REMOVE!")
//             item = null
//           } else {
//             console.log(item.id, "Not skinny. It can stay.")
//           }

//         }
//         // troubleshoot reload problem
//         removeSkinnyImages()


//     // =========================================

//     async function imageManipulation() {

//           let widthDim = 1024;
//           let heightDim = 576;
//           const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
          
//           // If there's no image to manipulate, skip
//           if (item == null) {
//             return
            
//           } else if (aspectRatio > 1.78) {
//             console.log(item.id, "LONG LANDSCAPE: bars on top")
//             // contain
            
//           } else if (aspectRatio === 1.78) {
//             console.log(item.id, "PERFECT LANDSCAPE")
//             // contain
            
//           } else if ((aspectRatio > 1) && (aspectRatio < 1.78)) {
//             console.log(item.id, "SQUAT LANDSCAPE: bars on side")
//             // contain

//           } else if (aspectRatio === 1) {
//             console.log(item.id, "SQUARE: bars on side")
//             // contain

//           }  else if (aspectRatio < 1) {
//             console.log(item.id, "PORTRAIT: crop height, bars on side")
//             // do stuff
//           }

//           meetingBackground
//           .autocrop([40, false])
//           .quality(80) 
//           // .cover = scale the image to the given width and height,
//           // (image may be clipped)
//           // .cover(widthDim, heightDim) // .cover( w, h[, alignBits || mode, mode] );
//           // .contain = Scale the image to the given width and height,
//           // (image may be letter boxed)
//           .contain(widthDim, heightDim)
//           .background(0x26262626)
//           .print(font, 10, 536, item.title)
//           .getBuffer(Jimp.MIME_JPEG, (error, img) => {
//             if (error) reject(error);
//             else saveImageToBucket(img, value, item.id)
//           })
//         }
//         imageManipulation()
    
//     // =========================================

//       }).catch(err => {
//         console.error("Jimp-related server error:", err);
//       });

//     // The location of where we're saving the image once it's been processed.
//     // Storing this in the json will make it easier to find on the client
//     function addLocalImageLocation() {
//       console.log("💎 inserting image location")
//       item["imgFileLocation"] = './meeting-backgrounds/' + value + '/' + item.id + '.jpg';
//     }
//     addLocalImageLocation()

// };

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
}).on('error:', console.error);


module.exports = app;
