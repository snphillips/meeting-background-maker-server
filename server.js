// so we can use environment variables from a .env file
// into process.env
require('dotenv').config()

//import express
const express = require('express');
// initialize the app
const app = express();

// const logger = require('morgan');

const axios = require('axios');


// **********************************
// CORS
// npm package to allow cross origin resource sharing
// **********************************
const cors = require('cors')
app.use(cors())

// Body-parser captures data coming via a form.
// Allows our forms to work)
const bodyParser = require('body-parser');


// set the port, either from an environmental variable or manually
const port = process.env.PORT || 3001;



// **********************************
// index route
// **********************************
app.get('/', (req, res, next) => {
  res.send(`Hello world, let's get some meeting backgrounds.`)
})


// **********************************
// Get All - Search by Tag
// **********************************
app.get('/searchbytag/:value', (req, res, next) => {
  const { value } = req.params;

  axios.get(`https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=100&tag=${value}`)
  .then((response) => {
    console.log("response length for keyword:", req.params, "is", response.data.objects.length)
    console.log("This is the response:", response.data.objects)


   // **********************************
   // Image manipulation
   // 1) kick out skinny images
   // 2) rotate portrait images
   // 3) check against blacklist
   // **********************************
    let responseItems = response.data.objects

    responseItems.forEach( (item) => {
      let imageUrl = item.images[0].b.url
      console.log("image url:", imageUrl)
    })






    // This is what you're sending to client
    return res.json(response.data.objects)
  })
  .catch((error) => {
    console.log(error)
    res.send(`I cant' find any items right now.`);
  });
});




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
// Middleware that adds a X-Response-Time
// header to responses.
// **********************************
// app.use(responseTime());

// **********************************
// Port
// **********************************
app.listen(port, () => {
  console.log(`Let's get some meeting backgrounds! Listening on port: ${port}, in ${app.get('env')} mode.`);
}).on('error', console.error);


module.exports = app;
