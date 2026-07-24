const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

// Small helper — deletes an image from Cloudinary, but never crashes the request if it fails
const safeDeleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete failed for', publicId, err.message);
  }
};

// @desc   Get all projects
// @route  GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single project by ID
// @route  GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create new project
// @route  POST /api/projects
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Update project
// @route  PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If a new image is being set and it's different from the current one,
    // delete the old image from Cloudinary so it doesn't linger unused.
    const newPublicId = req.body.imagePublicId;
    if (
      newPublicId !== undefined &&
      existing.imagePublicId &&
      existing.imagePublicId !== newPublicId
    ) {
      await safeDeleteFromCloudinary(existing.imagePublicId);
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete project
// @route  DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Remove the image from Cloudinary first, then remove the DB document.
    await safeDeleteFromCloudinary(project.imagePublicId);
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};