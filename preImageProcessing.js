// so we can use environment variables from a .env file
// into process.env
require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors())

// Body-parser captures data coming via a form
const bodyParser = require('body-parser');

const axios = require('axios');
const _Lodash = require('lodash');
const tagArray = require('./tagArray');
const { processingFunc } = require('./processingFunc');

// set the port, either from an environmental variable or manually
const port = process.env.PORT || 3002;

console.log("🦄 🦄 🦄 🦄 🦄 , Hello.")


app.get('/', (req, res, next) => {
  res.send(`Hello world, let's preprocess some meeting backgrounds.`)
})

function test(){
  console.log("test")
}
test();



function generateImages(value){
  
  // app.get('/:value', cors(), (req, res, error) => {
    
    console.log("value axios sarch:", value)
    // const { value } = req.params;
  
    axios({
      method: 'get',
      url: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`,
    }).then( (response) => {

        console.log("🦄  HELLO from prewarm .then", response.data.objects)
        
        let tempData = response.data.objects
        
        // Mapping over all the returned images and processing
        // them all through processingFunc (find this big function
        // in processingFunc.js)
        tempData.map((item) => {
          console.log("hi")
          processingFunc(item, value)
        })
        
        // Remove null values
        // processingFunc may have created null values if it
        // encountered. This removes them from the array. 
        data = _Lodash.compact(tempData)
        
        // return data  
        return res.json(data)
        
    }).catch(function (error) {
      console.log("searchbyvalue error:", error);
    });
  // })
}  

tagArray.forEach(generateImages);










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
