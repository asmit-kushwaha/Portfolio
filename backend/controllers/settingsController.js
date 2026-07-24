const Settings = require('../models/Settings');
const { cloudinary } = require('../config/cloudinary');

const safeDeleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete failed for', publicId, err.message);
  }
};

// @desc   Get site settings (public)
// @route  GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update site settings (admin only)
// @route  PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    const {
      profileImage,
      profileImagePublicId,
      showProfileImage,
      resumeUrl,
      resumePublicId,
      showFunLink,
      githubUsername,
      showGithubGraph,
      nowText,
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        profileImage,
        profileImagePublicId,
        showProfileImage,
        resumeUrl,
        resumePublicId,
        showFunLink,
        githubUsername,
        showGithubGraph,
        nowText,
        nowUpdatedAt: nowText !== undefined ? new Date() : null,
      });
      return res.status(200).json(settings);
    }

    // Replacing the profile image — delete the old Cloudinary file first
    if (
      profileImagePublicId !== undefined &&
      settings.profileImagePublicId &&
      settings.profileImagePublicId !== profileImagePublicId
    ) {
      await safeDeleteFromCloudinary(settings.profileImagePublicId, 'image');
    }

    // Replacing the resume — delete the old Cloudinary file first (raw resource type)
    if (
      resumePublicId !== undefined &&
      settings.resumePublicId &&
      settings.resumePublicId !== resumePublicId
    ) {
      await safeDeleteFromCloudinary(settings.resumePublicId, 'raw');
    }

    if (profileImage !== undefined) settings.profileImage = profileImage;
    if (profileImagePublicId !== undefined) settings.profileImagePublicId = profileImagePublicId;
    if (showProfileImage !== undefined) settings.showProfileImage = showProfileImage;
    if (resumeUrl !== undefined) settings.resumeUrl = resumeUrl;
    if (resumePublicId !== undefined) settings.resumePublicId = resumePublicId;
    if (showFunLink !== undefined) settings.showFunLink = showFunLink;
    if (githubUsername !== undefined) settings.githubUsername = githubUsername;
    if (showGithubGraph !== undefined) settings.showGithubGraph = showGithubGraph;
    if (nowText !== undefined && nowText !== settings.nowText) {
      settings.nowText = nowText;
      settings.nowUpdatedAt = new Date();
    }

    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Remove the profile image entirely
// @route  DELETE /api/settings/profile-image
const removeProfileImage = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings || !settings.profileImage) {
      return res.status(404).json({ message: 'No profile image to remove' });
    }

    await safeDeleteFromCloudinary(settings.profileImagePublicId, 'image');

    settings.profileImage = '';
    settings.profileImagePublicId = '';
    settings.showProfileImage = false;
    await settings.save();

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Remove the resume entirely
// @route  DELETE /api/settings/resume
const removeResume = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings || !settings.resumeUrl) {
      return res.status(404).json({ message: 'No resume to remove' });
    }

    await safeDeleteFromCloudinary(settings.resumePublicId, 'raw');

    settings.resumeUrl = '';
    settings.resumePublicId = '';
    await settings.save();

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings, removeProfileImage, removeResume };