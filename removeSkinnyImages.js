


/* =========================================
  If the image is too skinny to be an appropriate
  background, turn it to null
  (we're going to get rid of null values later)
========================================= */

    function removeSkinnyImages(item, height, width) {

      if ( (height > width) && ((height / width) > 4 ) ) {
        console.log('🗼', item.id, "Skinny PORTRAIT, null!")
        item = null
        // _Lodash.remove(responseItems, item)
      } else if ( (width > height) && ((width / height) > 4 ) ) {
        console.log('🚣‍♀️', item.id, "Skinny LANDSCAPE, null!")
        item = null
      } else {
        console.log(item.id, "Not skinny. It can stay.")
      }
    }

    exports.removeSkinnyImages = removeSkinnyImages