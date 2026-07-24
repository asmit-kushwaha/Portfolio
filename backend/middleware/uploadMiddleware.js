const multer = require('multer');
const { imageStorage, resumeStorage } = require('../config/cloudinary');

const upload = multer({ storage: imageStorage });        // project/profile images
const uploadResume = multer({ storage: resumeStorage });  // resume PDF

module.exports = { upload, uploadResume };