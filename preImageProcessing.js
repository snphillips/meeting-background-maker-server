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
// const _Lodash = require('lodash');
const tagArray3 = require('./tagArray2');
const { processingFunc } = require('./processingFunc');


// set the port, either from an environmental variable or manually
const port = process.env.PORT || 3002;

console.log("🦄 🦄 🦄 🦄 🦄 , Hello.")


app.get('/', (req, res, next) => {
  res.send(`Hello world, let's preprocess some meeting backgrounds.`)
})

function generateImages(value){
  
    console.log("value axios sarch:", value)
  
    axios({
      method: 'get',
      url: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`,
    }).then( (response) => {

        console.log("🦄  HELLO from prewarm .then", value)
        
        let tempData = response.data.objects
        tempData.map((item) => {
          processingFunc(item, value)
        })

        
      }).catch(function (error) {
      console.log("searchbyvalue error:", error);
    });
  // })
}  

tagArray3.forEach(generateImages);
// testTagArray.forEach(generateImages);










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
