const rotateImageArray = require('../rotateImageArray');

function mergeTheRotateArray(rotateArray) {
    rotateImageArray.map((listItem) => {
        rotateArray.push(...listItem.rotateListId); // Use spread operator if listItem.rotateListId is an array
    });

    // Create a new array to merge and remove duplicates
    let mergedRotateArray = [...new Set([].concat.apply([], rotateArray))];

    // Return the merged array
    return mergedRotateArray; 
}

module.exports = { mergeTheRotateArray };
