const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "eu-west-2",
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY"
  }
});


const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.listen(3000, () => {
  console.log("Server running on port 3000");
});