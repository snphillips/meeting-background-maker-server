// *********************************
// AWS
// *********************************

require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

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
function saveImageToBucket(image) {

  console.log("💾 saveImageToBucket!!! ", image.imgFileLocation)

  const fileStream = fs.createReadStream(image.imgFileLocation)
  
  const uploadParams = {
    Bucket: awsBucketName,
    Body: fileStream,
    Key: image.id + `.jpg`
  }
  return s3Bucket.upload(uploadParams).promise()
}
exports.saveImageToBucket = saveImageToBucket

// ================================
// downloads a file to aws s3
// ================================
// function getFileStream(fileKey) {

//   console.log("get image from bucket");

//   const downloadParams = {
//     Key: fileKey,
//     Bucket: awsBucketName
//   }
//   return s3.getObject(downloadParams).createReadStream()
// }


// exports.getFileStream = getFileStream

