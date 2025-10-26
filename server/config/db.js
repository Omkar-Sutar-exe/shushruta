const mongoose = require("mongoose");
try {
  mongoose.connect("mongodb://127.0.0.1:27017/Shushruta", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Use createIndex instead of deprecated ensureIndex
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
  });
  console.log("Database Connected Successfully");
} catch (err) {
  console.log("Database Not Connected:", err.message);
}
