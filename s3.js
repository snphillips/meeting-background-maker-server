// *********************************
// AWS
// *********************************

require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
// const fs = require('fs');
// const Buffer = require('buffer');
// const JSZip = require('jszip');

const awsBucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3Bucket = new S3({
  region, 
  accessKeyId,
  secretAccessKey
})

// ================================
// uploads a file to aws s3
// ================================
function saveImageToBucket(imageInBuffer, value, imageId) {

  console.log("💾 saveImageToBucket!!! ", imageInBuffer.length, value)
  
  const params = {
    Bucket: awsBucketName + `/` + value,
    Body: imageInBuffer,
    Key: imageId + `.jpg`
  }
  return s3Bucket.upload(params).promise()
}
exports.saveImageToBucket = saveImageToBucket

