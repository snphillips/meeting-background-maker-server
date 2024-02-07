/* *********************************
  AWS
  https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
********************************* */

require('dotenv').config();

const { Upload } = require('@aws-sdk/lib-storage');
const { S3 } = require('@aws-sdk/client-s3');

const awsBucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3Bucket = new S3({
  region,

  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

/*  ================================
  Uploads a file to aws s3

  This function is used by processingFunc to upload
  the image to aws s3 bucket once image processing is done.

  imageInBuffer - the image in buffer
  value - the search value (like, "cubism" or "textile")
  which we are using to create subdirectories
  imageId -  what we're using as the file name (item.id)
================================ */
function saveImageToBucket(imageInBuffer, imageId) {

  console.log("💾 4) Save image to aws bucket")
  
  const params = {
    Bucket: awsBucketName,
    Body: imageInBuffer,
    Key: `meeting-backgrounds/${imageId}.jpg`
  }
  return new Upload({
    client: s3Bucket,
    params
  }).done();
}
exports.saveImageToBucket = saveImageToBucket