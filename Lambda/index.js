let config = require("config");
let AWS = require("aws-sdk");
let s3 = new AWS.S3({apiVersion: "2006-03-01"});
let rekognition = new AWS.Rekognition();
let docClient = new AWS.DynamoDB.DocumentClient();

let lambdaCallback, bucket, key;

exports.handler = function(event, context, callback) {
  lambdaCallback = callback
  bucket = event.Records[0].s3.bucket.name;
  key = event.Records[0].s3.object.key;
  rekognizeLabels(bucket, key)
    .then(function(data) {
      labelData = data["Labels"];
      return rekognizeText(bucket, key)
    }).then(function(textData) {
      textDetect = textData["TextDetections"];
      return addToTextTable()
    }).then(function(data) {
      console.log("Data added to " + config.dynamo.tableName + " Table");
      lambdaCallback(null, data)
    }).catch(function(err) {
      lambdaCallback(err, null);
    });
};

function addToTextTable() {
  let labels = []
  labelData.forEach(function(label) {
    labels.push(label.Name)
  });
  let detectedText = textDetect[0]["DetectedText"];
  let detectedConf = textDetect[0]["Confidence"];

  let params = {
    TableName: config.dynamo.tableName,
    Item: {
      faceId: 1,
      filename: key.split(".")[0],
      timestamp: new Date().getTime(),
      PrimaryDetect: detectedText,
      PrimaryConf: detectedConf,
      labels: labels
    }
  };

  return docClient.put(params).promise()
};

function rekognizeText(bucket, key) {
  let params = {
    /*Attributes: ["ALL"],*/
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  };

  return rekognition.detectText(params).promise()
};

function rekognizeLabels(bucket, key) {
  let params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    },
    MaxLabels: 100,
    MinConfidence: 40
  };

  return rekognition.detectLabels(params).promise()
};
