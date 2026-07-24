const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for project/profile images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio-projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

// Storage for resume — Cloudinary stores non-image files (PDFs) as "raw" resources
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio-resume',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
  },
});

// 'storage' kept as an alias for imageStorage so nothing else that imports it breaks
module.exports = { cloudinary, storage: imageStorage, imageStorage, resumeStorage };