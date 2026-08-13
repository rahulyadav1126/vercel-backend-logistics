const multer = require('multer');
const path = require('path');
const fs = require('fs');

let storage;
const useCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME;

if (useCloudinary) {
  storage = multer.memoryStorage();
} else {
  // Ensure uploads directory exists
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Storage engine config
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
}

// File filter based on type
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|pdf|doc|docx/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, webp) and documents (pdf, doc, docx) are allowed!'));
  }
};

const rawMulter = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, originalName) => {
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const ext = path.extname(originalName).toLowerCase();
    let resource_type = 'auto';
    if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
      resource_type = 'raw';
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'logistics-manpower',
        resource_type: resource_type,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

// Export wrapped multer methods
const upload = {
  single: (fieldName) => {
    const originalMiddleware = rawMulter.single(fieldName);
    return (req, res, next) => {
      originalMiddleware(req, res, async (err) => {
        if (err) return next(err);
        if (!req.file || !useCloudinary) return next();

        try {
          const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
          // Set filename to public_id and path to the secure URL
          req.file.filename = result.public_id;
          req.file.path = result.secure_url;
          next();
        } catch (uploadErr) {
          next(uploadErr);
        }
      });
    };
  },
};

module.exports = upload;
