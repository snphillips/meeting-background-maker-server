
const Jimp = require('jimp');

const { saveImageToBucket } = require('./s3')


// =====================================
// The big function where we do all kinds of stuff to the 
// returned images  
// "item" is every item in responseItems, which we're mapping over
// This function is imported into server.js
// =====================================  
const processingFunc = (item) => {

  // TODO: add an error catch
  let imageUrl = item.images[0].b.url

  Jimp.read(imageUrl).then( (meetingBackground) => {
    
      let width = meetingBackground.bitmap.width
      let height = meetingBackground.bitmap.height
      let aspectRatio = width/height
      // console.log("jimp meetingBackground object: ", meetingBackground)
      console.log("processing: ", item.id, "width: ", width, "height: ", height)

    // =========================================
    // If the image is too skinny to be an appropriate
    // background, turn it to null
    // (we're going to get rid of null values later)
    // =========================================
    function removeSkinnyImages() {

      if ( (height > width) && ((height / width) > 2 ) ) {
        console.log('🧹', item.id, "Skinny PORTRAIT, REMOVE!")
        item = null
        // _Lodash.remove(responseItems, item)
      } else if ( (width > height) && ((width / height) > 2 ) ) {
        console.log('🚣‍♀️', item.id, "Skinny LANDSCAPE, REMOVE!")
        item = null
      } else {
        console.log(item.id, "Not skinny. It can stay.")
      }

    }
    // TODO: troubleshoot reload problem
    // response contains skinny images even though we try to remove them
    // Don't invoke this function until we figure this out.
    // removeSkinnyImages()


// =========================================

async function imageManipulation() {
      const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
      const totalWidthDim = 1024;
      const imageHeightDim = 501;
      const totalHeightDim = 576;
      const margin = 10;
      const textMedium = (item.medium || item.type || '')
      let textMediumWidth = Jimp.measureText(font, textMedium);
      let rightJustify = (totalWidthDim - textMediumWidth - margin)
      // ternary 
      rightJustify < 512 ? rightJustify = 512 : rightJustify;
      
      let horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
      let verticalAlign = Jimp.VERTICAL_ALIGN_TOP;
      // console.log("🌵 textMediumWidth:", textMediumWidth)
      // console.log("🌵 rightJustify:", rightJustify)

      // If there's no image to manipulate, skip
      if (item === null) {
        return
        
      } else if (aspectRatio > 1.78) {
        console.log(item.id, "LONG LANDSCAPE: bars on top")
        horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
        verticalAlign = Jimp.VERTICAL_ALIGN_MIDDLE;
        
      } else if (aspectRatio === 1.78) {
        console.log(item.id, "PERFECT LANDSCAPE")
        horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
        verticalAlign = Jimp.VERTICAL_ALIGN_MIDDLE;
        
      } else if ((aspectRatio > 1) && (aspectRatio < 1.78)) {
        console.log(item.id, "SQUAT LANDSCAPE: bars on side")
        horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
        verticalAlign = Jimp.VERTICAL_ALIGN_TOP;
        
      } else if (aspectRatio === 1) {
        console.log(item.id, "SQUARE: bars on side")
        horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
        verticalAlign = Jimp.VERTICAL_ALIGN_TOP;
        
      }  else if (aspectRatio < 1) {
        console.log(item.id, "PORTRAIT: crop height, bars on side")
        horizontalAlign = Jimp.HORIZONTAL_ALIGN_LEFT;
        verticalAlign = Jimp.VERTICAL_ALIGN_TOP;
      }

      meetingBackground
      .autocrop([40, false])
      .quality(90) 
      // .cover = scale the image to the given width and height,
      // (image may be clipped)
      // .cover(totalWidthDim, totalHeightDim) // .cover( w, h[, alignBits || mode, mode] );
      // .contain = Scale the image to the given width and height,
      // (image may be letter boxed)
      .contain(totalWidthDim, imageHeightDim, horizontalAlign | verticalAlign)
      .contain(totalWidthDim, totalHeightDim, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_TOP)
      .background(0x26262626)
      .print(font, 10, 508, item.title || '')
      .print(font, 10, 528, item.medium || item.type || '')
      .print(font, 10, 548, item.year_end || item.date || '')

      .print(font, 634, 548, 'Image courtesy of the Cooper Hewitt Desgin Museum')
      // .getBuffer is a Jimp method, but the Jimp docs suck
      // https://stackoverflow.com/questions/60709561/how-convert-jimp-object-to-image-buffer-in-node
      .getBuffer(Jimp.MIME_JPEG, (error, img) => {
        if (error) {
          console.log("getBuffer error:", error)
          reject(error)
        } else {
          // Save to AWS bucket
          // img - the image in buffer
          // which we are using to create subdirectories
          // item.id -  what we're using as the file name
          saveImageToBucket(img, item.id)
        }
      })
    }
    imageManipulation()

// =========================================

  }).catch(err => {
    console.error("Jimp-related server error:", err);
  });

// The location of where we're saving the image once it's
// been processed. Storing this in the json will make it
// easier to find on the client
function addLocalImageLocation() {
  console.log("💎 inserting image location")
  item["imgFileLocation"] = 'https://meeting-background-maker.s3.amazonaws.com/meeting-backgrounds/' + item.id + '.jpg';
}
addLocalImageLocation()

};


exports.processingFunc = processingFunc