const StudentProfile = require('../models/StudentProfile');

exports.listStudents = async (req, res, next) => {
  try{
    const { batch, location, trainingPartner, jobRole, q } = req.query;
    const filter = {};
    if (batch) filter.trainingBatch = batch;
    if (location) filter.location = location;
    if (trainingPartner) filter.trainingPartner = trainingPartner;
    if (jobRole) filter.jobRole = jobRole;
    if (q) filter.$text = { $search: q };
    const items = await StudentProfile.find(filter).limit(500).sort('-updatedAt');
    res.json(items);
  }catch(err){ next(err); }
};

exports.defineDynamicFields = async (req, res, next) => {
  try{
    const { fields } = req.body;
    req.app.set('dynamicFields', fields || []);
    res.json({ ok: true, fields: fields || [] });
  }catch(err){ next(err); }
};