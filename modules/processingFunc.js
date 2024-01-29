const Jimp = require('jimp');
const { saveImageToBucket } = require('./s3');
const  { mergedRotateArray } = require('./mergeTheRotateArray');

/*
=====================================
The big function where we do all kinds of
stuff to the returned images.

The parameter "item" is every item in responseItems, which
we're mapping over.
 
This function is imported into preImageProcessing.js
=====================================
*/

const processingFunc = async (item, mergedRotateArray) => {
  try {
    let imageUrl = item.images[0].b.url;
    let meetingBackground = await Jimp.read(imageUrl);
    
    await imageManipulation(meetingBackground, item, mergedRotateArray);

    addLocalImageLocation(item);
  } catch (err) {
    console.error("Error in processingFunc:", err);
  }
};

async function imageManipulation(meetingBackground, item, mergedRotateArray) {
  console.log("🎨 2) Begin image manipulation")
  let width = meetingBackground.bitmap.width;
  let height = meetingBackground.bitmap.height;
  let aspectRatio = width / height;
  let degreeRotate = 0;
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
  const totalWidthDim = 1024;
  const imageHeightDim = 501;
  const totalHeightDim = 576;
  const margin = 10;
  let horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
  let verticalAlign = Jimp.VERTICAL_ALIGN_TOP;
  
  // Some images needs rotating
  function rotate() {
    
    if (item === null) return
    console.log("🎠 3) Check if image needs rotating")

    // Iterate over the the mergedRotateArray
    for (let i = 0; i < mergedRotateArray.length - 1; i++) {
        if (item.id === mergedRotateArray[i]) {
          degreeRotate = 90
          console.log(`👍 Rotate image by ${degreeRotate} degrees.`)
          return
        } else {
          degreeRotate = 0
        }
      }
    }

  rotate();
      
      // If there's no image to manipulate, skip
      if (item === null) {
        return
  
      } else if ( (aspectRatio >= 1.78) || (degreeRotate === 90) ) {
        horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
        verticalAlign = Jimp.VERTICAL_ALIGN_MIDDLE;  
      } 
      else if (aspectRatio >= 1) {
        horizontalAlign = Jimp.HORIZONTAL_ALIGN_CENTER;
        verticalAlign = Jimp.VERTICAL_ALIGN_TOP;
      }
      else if ((aspectRatio < 1) && (degreeRotate === 0)) {
        horizontalAlign = Jimp.HORIZONTAL_ALIGN_LEFT;
        verticalAlign = Jimp.VERTICAL_ALIGN_TOP;
      }
      else if ((aspectRatio < 1) && (degreeRotate === 90)) {
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
  
        .print(font, 634, 548, 'Image courtesy of the Cooper Hewitt Design Museum')
        // .getBuffer is a Jimp method, but the Jimp docs suck
        // https://stackoverflow.com/questions/60709561/how-convert-jimp-object-to-image-buffer-in-node
        .getBuffer(Jimp.MIME_JPEG, (error, img) => {
          if (error) {
            console.log("getBuffer error:", error)
            reject(error)
          } else {
            /* 
            Save to AWS bucket
            img: the image in buffer
            that we're using to create subdirectories
            item.id:  what we're using as the file name */
            saveImageToBucket(img, item.id)
          }
        })

}

function addLocalImageLocation(item) {
 console.log("📌 5) Insert image location")
 item["imgFileLocation"] = 'https://meeting-background-maker.s3.amazonaws.com/meeting-backgrounds/' + item.id + '.jpg';
}



exports.processingFunc = processingFunc