// *********************************
// AWS
// *********************************

require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
const s3Zip = require('s3-zip');
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
    Bucket: awsBucketName + `meeting-backgrounds/` + value,
    Body: imageInBuffer,
    Key: imageId + `.jpg`
  }
  return s3Bucket.upload(params).promise()
}
exports.saveImageToBucket = saveImageToBucket


// ================================
// zip selected files in aws
// note: using npm package s3-zip
// https://github.com/orangewise/s3-zip
// ================================
function downloadZip(snakes) {

  const folder = 'meeting-backgrounds/';
  const files = ['18728283.jpg', '18643663.jpg']
  // const awsBucketName = process.env.AWS_BUCKET_NAME;
  // const region = process.env.AWS_BUCKET_REGION;
  // const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  // const secretAccessKey = process.env.AWS_SECRET_KEY;


  // const AWS = require('aws-sdk')
  // const S3 = require('aws-sdk/clients/s3');

  // const s3Bucket = new S3({
  //   region, 
  //   accessKeyId,
  //   secretAccessKey
  // })
  
  console.log("🗜🗜🗜🗜 s3zip")
  
  s3Zip
    .archive({ 
      s3: s3Bucket,
      region: region, 
      bucket: awsBucketName,
      preserveFolderStructure: true,
    }, folder, files)
    .pipe( snakes.attachment() )
}
exports.downloadZip = downloadZip
