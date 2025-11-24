const path = require('path');
const multer = require('multer');

// Configure storage for multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // The 'uploads' folder should be in the backend's root directory
    // Make sure you have an 'uploads' folder in your 'backend' directory
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Generate a unique filename to avoid conflicts
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only images (jpeg, png, jpg)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png)'));
  }
}

// Initialize upload middleware with storage and file filter
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;