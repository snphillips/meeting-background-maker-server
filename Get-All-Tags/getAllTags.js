
/*
**********************************
Gets all the search tags 
(to create the dropdown menu)

 **** NOT USING AT THE MOMENT. ****

We used this once to get the values we needed.
The values do not change, so there is no need 
to keep hitting the API. 
We're keeping the function in case we do want
to retrieve the values again.
Note: currently we have `&per_page=10`to return only 10 tags - change that.

To run:
1) navigate into the Get-All-Tags directory.
2) in your terminal run:
  node getAllTags
**********************************
*/

const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const getAllTags = () => {
  const url = `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.tags.getAll&access_token=${process.env.COOPER_API_TOKEN}&sort=count&sort_order=desc&page=1&per_page=10`;

  return axios({
    url: url,
    method: 'get',
    // DANGER
    // For development or debugging, you can ignore SSL verification
    httpsAgent: new (require('https').Agent)({
      rejectUnauthorized: false,
    }),
  })
  .then((response) => {
    console.log('Response:', response.data);
    /*
    Names that are too long mess up the dropdown menu UI.
    Here we filter the array of tag words, and keep the
    ones that are shorter than 16 characters.
    */
    let tempArray = response.data.tags;
    tempArray = tempArray.filter(function (obj) {
      return obj.name.length < 16;
    });
    return tempArray;
  })
  .catch((error) => {
    console.log('axios get alltags error:', error);
    return [];
  });
};

getAllTags();

module.exports = getAllTags;
