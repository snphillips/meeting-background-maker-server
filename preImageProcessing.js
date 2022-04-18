// so we can use environment variables from a .env file
// into process.env
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())

// Body-parser captures data coming via a form
const bodyParser = require('body-parser');

const axios = require('axios');
const { processingFunc } = require('./processingFunc');
const tagArrayTest = require('./tagArrayTest');

// set the port, either from an environmental variable or manually
const port = process.env.PORT || 3002;

console.log("🦄 🦄 🦄 🦄 🦄 ")

app.get('/', (req, res, next) => {
  res.send(`Hello world, let's preprocess some meeting backgrounds.`)
})



function generateImages(value){
  
  console.log("Looking up", value, "which is ", tagArrayTest
  .indexOf(value), " out of ", tagArrayTest
  .length - 1 , "tags")
  
    axios({
      method: 'get',
      url: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`,
    }).then( (response) => {

        let tempData = response.data.objects

        tempData.map((item) => {
          processingFunc(item, value)
        })
  
      }).then(() => {
        console.log("I am done getting & processing images.")
      }).catch(function (error) {
      console.log("searchbyvalue error:", error);
    });
}  

// tagArray1.forEach(generateImages);
// tagArray2.forEach(generateImages);
// tagArray3.forEach(generateImages);
// tagArray4.forEach(generateImages);
// tagArray5.forEach(generateImages);
// tagArray6.forEach(generateImages);
// tagArray7.forEach(generateImages);
tagArrayTest.forEach(generateImages);


// **********************************
// Error Handlers
// **********************************
app.use((err, req, res, next) => {
  res.json(err);
  res.status(500).send('Oh no a 500 error.')
});

app.use((req, res, next) => {
  res.status(404).send(`Oh no a 404 error. I can't find that.`)
})


app.use(bodyParser.json());

// **********************************
// Port
// **********************************
app.listen(port, () => {
  console.log(`Let's get some meeting backgrounds! Listening on port: ${port}, in ${app.get('env')} mode.`);
}).on('port error:', console.error);


module.exports = app;
