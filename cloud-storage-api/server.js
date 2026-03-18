require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const app = express();
app.use(cors());

const upload = multer({
storage: multer.memoryStorage(),
limits: { fileSize: 10 * 1024 * 1024 }
});

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
return res.status(400).send("No file uploaded");
}

// basic file type validation
if (!file.mimetype.includes("pdf") && !file.mimetype.includes("image")) {
return res.status(400).send("Invalid file type");
}

const filename = Date.now() + "_" + file.originalname;

const params = {
Bucket: "YOUR_BUCKET_NAME",
Key: filename,
Body: file.buffer
};

try {
await s3.send(new PutObjectCommand(params));
res.send(`File uploaded: ${filename}`);
} catch (err) {
console.error(err);
res.status(500).send("Upload failed");
}
});

// Download route
app.get("/download/:filename", async (req, res) => {

const para
