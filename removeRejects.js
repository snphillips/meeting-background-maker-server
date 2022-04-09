
const removeListArray = require('./removeListArray');

// ===========================
// Remove Rejects
// For various reasons we don't want certain images to display 
// ...like they suck, or are miscategorized.
// This function compares images to removeListArray
// ===========================
function removeRejects(removeListArray) {
  let rejectsArray = [];
  let mergedRejectsArray = [];
  
  // 1) Create master reject array
  removeListArray.map( (listItem) => {
    // smush all the arrays together
    rejectsArray.push(listItem.removalListId)
    // now remove the extra array brackets
    mergedRejectsArray = [].concat.apply([], rejectsArray);
  })
  
  // 2) Nested loop over both arrays to look for matches in the
  // reject array. We're making a new temporary array called
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

exports.removeRejects = removeRejects