const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// API endpoint to upload and save file
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded and saved on server', filePath: req.file.path });
});

// API endpoint to retrieve file from server
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});