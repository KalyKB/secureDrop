require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// AWS setup
const s3 = new S3Client({
region: "eu-west-2",
credentials: {
accessKeyId: process.env.AWS_ACCESS_KEY,
secretAccessKey: process.env.AWS_SECRET_KEY
}
});

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {

const file = req.file;

if (!file) {
return res.status(400).send("No file
