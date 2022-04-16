
const Jimp = require('jimp');
const { saveImageToBucket } = require('./s3');
const rotateImageArray = require('./rotateImageArray');


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
    console.log("🤖 processing: ", item.id, "width: ", width, "height: ", height)

    // function removeSkinnyImages(item, height, width) {
    function removeSkinnyImages() {

      if ( (height > width) && ((height / width) > 4 ) ) {
        console.log('🗼', "Skinny PORTRAIT, null!", item.id)
        item = null
        // _Lodash.remove(responseItems, item)
      } else if ( (width > height) && ((width / height) > 4 ) ) {
        console.log('🚣‍♀️', "Skinny LANDSCAPE, null!", item.id)
        item = null
      } else {
        console.log(item.id, "Not skinny. It can stay.")
      }
    }    
    removeSkinnyImages()

// =========================================

  async function imageManipulation() {

    let degreeRotate = 0;
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
    const totalWidthDim = 1024;
    const imageHeightDim = 501;
    const totalHeightDim = 576;
    const margin = 10;
    let horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
    let verticalAlign = Jimp.VERTICAL_ALIGN_TOP;

    function rotate() {
      
      if (item === null) return
      console.log("🎠 hello from rotate()", item.id)

      // console.log("rotateImageArray:", rotateImageArray)
      let rotateArray = [];
      let mergedRotateArray = [];
      
      // Create master rotate array by 
      // pushing all the arrays together
      // then removing the extra array brackets
      rotateImageArray.map( (listItem) => {
        rotateArray.push(listItem.rotateListId)
        mergedRotateArray = [].concat.apply([], rotateArray);
      })
      
      // Iterate over the the mergedRotateArray
      for (let i = 0; i < mergedRotateArray.length - 1; i++) {
          if (item.id === mergedRotateArray[i]) {
            degreeRotate = 90
            console.log("🧚‍♀️ a match. ROTATE", item.id, mergedRotateArray[i], degreeRotate)
            return
          } else {
            degreeRotate = 0
            // console.log("not a match. don't rotate", item.id, mergedRotateArray[i], degreeRotate) 
          }
        }
      }

    rotate()
    
    // If there's no image to manipulate, skip
    if (item === null) {
      return

    } else if ( (aspectRatio >= 1.78) || (degreeRotate === 90) ) {
      console.log(item.id, "LONG LANDSCAPE")
      horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
      verticalAlign = Jimp.VERTICAL_ALIGN_MIDDLE;  
    } 
    else if (aspectRatio >= 1) {
      console.log(item.id, "SQUAT LANDSCAPE")
      horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
      verticalAlign = Jimp.VERTICAL_ALIGN_TOP;
    }
    else if ((aspectRatio < 1) && (degreeRotate === 0)) {
      console.log(item.id, "PORTRAIT: image left justified, bars on side")
      horizontalAlign = Jimp.HORIZONTAL_ALIGN_LEFT;
      verticalAlign = Jimp.VERTICAL_ALIGN_TOP;
    }
    else if ((aspectRatio < 1) && (degreeRotate === 90)) {
      console.log(item.id, "rotated PORTRAIT: bars on top")
      horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
      verticalAlign = Jimp.VERTICAL_ALIGN_MIDDLE;
    }

    meetingBackground
      // only certain images rotate. degreeRotate will be 0 or 90
      .rotate(degreeRotate) 
      .autocrop([40, false])
      .quality(90)
      .contain(totalWidthDim, imageHeightDim, horizontalAlign | verticalAlign)
      .contain(totalWidthDim, totalHeightDim, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_TOP)
      .background(0x26262626)
      .print(font, margin, 508, item.title || '')
      .print(font, margin, 528, item.medium || item.type || '')
      .print(font, margin, 548, item.year_end || item.date || '')

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
  // console.log("💎 inserting image location")
  item["imgFileLocation"] = 'https://meeting-background-maker.s3.amazonaws.com/meeting-backgrounds/' + item.id + '.jpg';
}
addLocalImageLocation()

};


exports.processingFunc = processingFunc