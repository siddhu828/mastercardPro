const xlsx = require('xlsx');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

exports.bulkCreate = async (req, res, next) => {
  try{
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'File required' });
    const wb = xlsx.read(file.buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(ws);
    const created = [];
    for (const r of rows){
      const { name, email, phone, role, batch, location, jobRole } = r;
      if (!email || !name) continue;
      const password = 'Welcome@123';
      const u = await User.findOne({ email }) || await User.create({ name, email, phone, password, role: role || 'student' });
      await StudentProfile.findOneAndUpdate(
        { userId: u._id },
        { trainingBatch: batch || '', location: location || '', jobRole: jobRole || '' , userId: u._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      created.push({ email });
    }
    res.json({ count: created.length, created });
  }catch(err){ next(err); }
};