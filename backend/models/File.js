const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  originalName: String,
  storedName: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  size: Number,
  mimeType: String
}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);