const { encryptFile } = require("./encryptHelper");

encryptFile(
  "./secureDrop/exampleSecret.js",
  "./secureDrop/exampleSecret.enc",
  process.env.DECRYPT_KEY
);

console.log("Encryption complete!");
