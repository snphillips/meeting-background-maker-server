const rotateImageArray = require('../rotateImageArray');

/*
We want to rotate SOME images, but not all.
Why? Some vertical images like patterns and wallpapers
can be rotated horizontally without compromising the 
image. Other images, like vases or portraits, make 
no sense if turned on their side. 

We keep track of images that can be rotated in rotateImageArray.
That array is a human-readable object. 
This function flattens that array.
*/

function mergeTheRotateArray(rotateArray) {
    rotateImageArray.map((listItem) => {
        // Use spread operator if listItem.rotateListId is an array
        rotateArray.push(...listItem.rotateListId); 
    });

    // Create a new array to merge and duplicates
    let mergedRotateArray = [...new Set([].concat.apply([], rotateArray))];

    // Return the merged array
    console.log('mergedRotateArray', mergedRotateArray)
    return mergedRotateArray; 
}

module.exports = { mergeTheRotateArray };
