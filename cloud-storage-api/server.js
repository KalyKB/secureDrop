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
region: "us-east-1",
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
if (
  !file.mimetype.includes("pdf") &&
  !file.mimetype.includes("image") &&
  !file.mimetype.includes("text")
) {
  return res.status(400).send("Invalid file type");
}

const filename = Date.now() + "_" + file.originalname;

const params = {
Bucket: "team-dropbox-storage-demo",
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

const params = {
Bucket: "team-dropbox-storage-demo",
Key: req.params.filename
};

try {
const data = await s3.send(new GetObjectCommand(params));


res.setHeader("Content-Disposition", `attachment; filename="${req.params.filename}"`);
data.Body.pipe(res);

} catch (err) {
console.error(err);
res.status(404).send("File not found");
}
});

// Start server
app.listen(3000, () => {
console.log("Server running on http://localhost:3000");
});
