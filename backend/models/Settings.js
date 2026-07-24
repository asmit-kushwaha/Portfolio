const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: '',
    },
    profileImagePublicId: {
      type: String,
      default: '',
    },
    showProfileImage: {
      type: Boolean,
      default: false,
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumePublicId: {
      type: String,
      default: '',
    },
    showFunLink: {
      type: Boolean,
      default: false,
    },
    githubUsername: {
      type: String,
      default: '',
    },
    showGithubGraph: {
      type: Boolean,
      default: false,
    },
    nowText: {
      type: String,
      default: '',
    },
    nowUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);