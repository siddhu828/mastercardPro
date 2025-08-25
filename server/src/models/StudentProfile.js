const mongoose = require('mongoose');
const { fieldEncryption } = require('mongoose-field-encryption');

const docSchema = new mongoose.Schema({
  type: { type: String, trim: true },
  url: String,
  publicId: String
}, { _id: false });

const jobSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: Date,
  endDate: Date,
  salary: Number
}, { _id: false });

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  personalInfo: {
    dob: Date,
    gender: String,
    address: String,
    city: String,
    state: String
  },
  familyBackground: {
    guardianName: String,
    incomeBracket: String
  },
  education: [{ degree: String, institute: String, year: Number, score: String }],
  jobHistory: [jobSchema],
  documents: [docSchema],
  trainingBatch: String,
  trainingPartner: String,
  jobRole: String,
  location: String,
  status: { type: String, enum: ['active','deactivated'], default: 'active' },
  consentAcceptedAt: Date
}, { timestamps: true });

profileSchema.plugin(fieldEncryption, {
  fields: ['personalInfo', 'familyBackground'],
  secret: process.env.FIELD_ENCRYPTION_SECRET,
  saltGenerator: () => '16charsSaltValue'
});

module.exports = mongoose.model('StudentProfile', profileSchema);