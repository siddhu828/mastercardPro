const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'y4d-docs',
    resource_type: 'auto',
    public_id: `${req.user._id}-${Date.now()}`
  })
});

exports.uploader = multer({ storage });

exports.handleUpload = async (req, res, next) => {
  try{
    const { path, filename } = req.file;
    res.json({ url: path, publicId: filename });
  }catch(err){ next(err); }
};