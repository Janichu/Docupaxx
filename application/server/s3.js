require('dotenv').config()
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const bucketName = process.env["AWS_S3_BUCKET_NAME"];
const region = process.env["AWS_S3_BUCKET_REGION"];
const accessKeyId = process.env["AWS_S3_ACCESS_KEY"];
const secretAccessKey = process.env["AWS_S3_SECRET_KEY"];

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})


// Takes a file (data bytes)
// Uploads it into S3
// Returns an object that has a URL
function uploadFile(file){
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}


// Takes a key
//   What is a key?
//      The URL part that gives the filename is the Key
//      For instance if the URL = "http://s3.bucket.12s5as5/TreeImage.png"
//      Then the key is Key = "TreeImage.png"
// Downloads the file (data bytes)
// Returns the file (data bytes)
function downloadFile(key) {
    const downloadParams = {
        Bucket: bucketName,
        Key: key
    }

    return s3.getObject(downloadParams).promise()
}


function getKeyFromUrl(url) {
    const urlParts = url.split(/[/]/)
    return urlParts[urlParts.length - 1]
}

exports.uploadFile = uploadFile
exports.downloadFile = downloadFile
exports.getKeyFromUrl = getKeyFromUrl
