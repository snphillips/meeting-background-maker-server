
const rotateImageArray  = require('../rotateImageArray');

let rotateArray = [];
let mergedRotateArray = [];


function mergeTheRotateArray() {
  // console.log("rotateImageArray:", rotateImageArray)
  
  /*
  Create master rotate array by 
  pushing all the arrays together
  then removing the extra array brackets
  */
  rotateImageArray.map( (listItem) => {
    rotateArray.push(listItem.rotateListId)
    mergedRotateArray = [].concat.apply([], rotateArray);
  })
  /*
  Remove duplicates from mergedRotateArray
  The Set object lets you store unique values 
  of any type, whether primitive values or object references.
  */
  mergedRotateArray = [...new Set(mergedRotateArray)];
  console.log("mergedRotateArray:", mergedRotateArray);
  return mergedRotateArray;
}

exports.mergeTheRotateArray = mergeTheRotateArray
exports.mergedRotateArray = mergedRotateArray