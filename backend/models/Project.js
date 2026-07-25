const mongoose = require('mongoose');
 
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    techStack: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '', // Cloudinary public_id — needed to delete the file when replaced/removed
    },
    github: {
      type: String,
      default: '',
    },
    live: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model('Project', projectSchema);
