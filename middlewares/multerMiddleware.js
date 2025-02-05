const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type'), false); // Reject file
  }
};


const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

module.exports = upload;

// const multer = require('multer');

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log(file);
//     cb(null, 'public/'); // Directory where files are saved
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Unique file names
//   },
// });

// // Filter files (optional: restrict to certain types like images only)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true); // Accept file
//   } else {
//     cb(new Error('Invalid file type'), false); // Reject file
//   }
// };

// // Initialize multer
// const upload = multer({ storage, fileFilter });


// module.exports = upload;




