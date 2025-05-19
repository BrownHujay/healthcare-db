// models/MedicalRecord.js
const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  record_date: { type: Date, default: Date.now },
  diagnosis_code: String, // ICD code
  description: String,
  allergies: [String],
  immunizations: [String],
  family_history: [String],
  notes: String
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
