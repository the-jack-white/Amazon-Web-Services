<h2>Rekognition TextDetect API in Lambda</h2>
A text recognizer when a text image in .jpg format is added to an AWS S3 bucket. The Lambda funtion takes the image, runs it through Rekognition and add the results in DynamoDB.

<h3>How to configure</h3>

<ol>
  <li>Create a brand new S3 bucket. <b>TIP</b>: Try not to use spaces in name.</li>
  <li>Create a brand new DynamoDB table. <b>TIP</b>: Try not to use spaces in name.</li>
  <li>Create an IAM Role with full permissions to S3, Lambda, DynamoDB and Cloudwatch.</li>
  <li>Create a new Lambda function, using the newly created S3 bucket as a trigger and newly created IAM role.</li>
  <li>Add the three files(<i>config.js, index.js, package.json</i>) to a directory in the funtion.</li>
  <li>Open the <i>config.js</i> file and edit the DynamoDB table name according to the name of the created table.</li>
</ol>
<br>
After following this configuration steps, the Lambda function should be in working condition, and can be tested by adding the <i>test.jpg</i> file to the S3 bucket, viewing the Cloudwatch Logs and see if there is any results in DynamoDB.
<br>
If not working, recreate a bucket and table with a new name and try again.
