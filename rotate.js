const rotateImageArray = require('./rotateImageArray');

// ===========================
// Rotate certain images
// This function compares images to rotateImageArray
// ===========================
function rotate(rotateImageArray, array) {
  let rotateArray = [];
  let mergedRotateArray = [];
  
  // 1) Create master rotate array
  rotateImageArray.map( (listItem) => {
    // smush all the arrays together
    rotateArray.push(listItem.rotateListId)
    // now remove the extra array brackets
    mergedRotateArray = [].concat.apply([], rotateArray);
  })
  
  // if any items in the following array match the mergedRotateArray,
  // then degreeRotate = 90, else 0

  for (let i = 0; i < array.length - 1; i++) {
    console.log("array[i].id", array[i].id)
    for (let j = 0; j < mergedRotateArray.length; j++) {
      if (array[i].id === mergedRotateArray[j]) {
        console.log("🎠 a match. ROTATE", array[i].id)
        degreeRotate = 90
      } else {
        degreeRotate = 0
      }
    }
  }

  console.log("mergedRotateArray:", mergedRotateArray)

}

exports.rotate = rotate