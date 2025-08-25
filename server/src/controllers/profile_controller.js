const StudentProfile = require('../models/StudentProfile');

exports.getMyProfile = async (req, res, next) => {
  try {
    const p = await StudentProfile.findOne({ userId: req.user._id });
    res.json(p || null);
  } catch (err) {
    next(err);
  }
};

exports.upsertMyProfile = async (req, res, next) => {
  try {
    const data = req.body;
    data.userId = req.user._id;
    const p = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(p);
  } catch (err) {
    next(err);
  }
};

exports.deactivateMyProfile = async (req, res, next) => {
  try {
    const p = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { status: 'deactivated' },
      { new: true }
    );
    res.json(p);
  } catch (err) {
    next(err);
  }
};