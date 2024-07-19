const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
dotenv.config({ path: "./.env" });

// Enable CORS
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// API endpoint to upload and save file
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded and saved on server",
    filePath: req.file.path,
  });
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(process.env.PORT, () => {
  console.log(`app is running at ${process.env.PORT}`);
});
