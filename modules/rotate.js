const rotateImageArray = require('../../rotateImageArray');

/* ===========================
Rotate certain vertical images

This function compares image id to those in rotateImageArray
We use an array of images we'd like to rotate instead
of having a rule to rotate ALL vertical images b/c
some images look ridiculous rotated, like a vase.
Imagese of patterns and wallpaper are appropriate to rotate.
=========================== */

function rotate(item) {
  console.log("🎠 hello from rotate()")
  // // console.log("rotateImageArray:", rotateImageArray)
  // let rotateArray = [];
  // let mergedRotateArray = [];
  
  // // Create master rotate array by 
  // // pushing all the arrays together
  // // then removing the extra array brackets
  // rotateImageArray.map( (listItem) => {
  //   rotateArray.push(listItem.rotateListId)
  //   mergedRotateArray = [].concat.apply([], rotateArray);
  // })
  
  // Iterate over the the mergedRotateArray
  for (let i = 0; i < mergedRotateArray.length - 1; i++) {
      if (item.id === mergedRotateArray[i]) {
        degreeRotate = 90
        console.log("🎠 a match. ROTATE", item.id, mergedRotateArray[i], degreeRotate)
        return
      } else {
        degreeRotate = 0
        // console.log("not a match. don't rotate", item.id, mergedRotateArray[i], degreeRotate) 
      }
    }
  }

exports.rotate = rotate