require('dotenv').config();
const s3Zip = require('s3-zip');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

const axios = require('axios');
const getAllTags = require('./Get-All-Tags/getAllTags'); // Import getAllTags function

// CORS: Allow requests from these origins:
const allowedOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173/',
  'https://meeting-background-maker.surge.sh'
];

const corsOptions = {
  origin: function (origin, callback) {
    /*
    Check if the origin is in the allowedOrigins array
    or if it's undefined (e.g., same-origin requests)
    */
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

// set the port, either from an environmental variable or manually
const port = process.env.PORT || 3001;

/*
**********************************
  index route
**********************************
*/
app.get('/', (req, res, next) => {
  res.send(`Hello world, let's make some meeting backgrounds.`);
});

/*
**********************************
Route to get all tags 
(to create the dropdown menu)

 **** NOT USING AT THE MOMENT. ****

We used this once to get the values we needed.
The values do not change, so there is no need 
to keep hitting the API. 
We're keeping the function in case we do want
to retrieve the values again.
********************************** 
*/
app.get('/alltags/', async (req, res) => {
  try {
    const tags = await getAllTags(); // Use getAllTags function
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/*
**********************************
  Gets all the items a value that matches keyword
********************************** 
*/
app.get('/searchbytag/:value', cors(), (req, res, error) => {
  const { value } = req.params;
  const url = `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=${process.env.COOPER_API_TOKEN}&has_images=1&per_page=20&tag=${value}`;

  axios({
    url: url,
    method: 'get',
    // DANGER: only use for development or debugging
    // For development or debugging, you can ignore SSL verification
    httpsAgent: new (require('https').Agent)({
      rejectUnauthorized: false,
    }),
  })
    .then((response) => {
      let data = response.data.objects;
      return res.json(data);
    })
    .catch(function (error) {
      console.log('searchbytag error:', error);
    });
});

const { GetObjectCommand, S3, S3Client } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const streamToString = require('stream-to-string');

/* **********************************
zip selected files in aws
note: using npm package s3-zip
https://github.com/orangewise/s3-zip

When the use hits the "Download Collection as Zip File"
button, an axios call is send from 
********************************** */
app.get('/download', (req, res) => {
  const awsBucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_BUCKET_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_KEY;

  const s3Bucket = new S3({
    region,

    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  console.log('🗜🗜🗜🗜 s3zip req.query:', req.query);

  /*
  The list of image jpegs comes from the client
  as an object called req.query.
  We use Object.values() to put the values into
  an array called jpegFiles, which we pass into
  s3Zip
  */
  const jpegFiles = Object.values(req.query);
  const folder = 'meeting-backgrounds/';

  s3Zip
    .archive(
      {
        s3: s3Bucket,
        region: region,
        bucket: awsBucketName,
        preserveFolderStructure: true,
      },
      folder,
      jpegFiles
    )
    .pipe(res.attachment());
});

/*
**********************************
Error Handlers
**********************************
*/
// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err);

  // Send an appropriate response to the client
  res.status(500).send('500 Internal Server Error');

  // If you don't use `next`, you can omit it, but it's good to include for consistency
  next();
});

app.use((req, res, next) => {
  res.sendStatus(404)
    // If you don't use `next`, you can omit it, but it's good to include for consistency
    next();
});

/*
**********************************
Port
**********************************
*/
app
  .listen(port, () => {
    console.log(
      `Let's get some meeting backgrounds! Listening on port: ${port}, in ${app.get('env')} mode.`
    );
  })
  .on('port error:', console.error);

module.exports = app;
