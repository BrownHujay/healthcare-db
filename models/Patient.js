//Patient.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  phone: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  emergency_contact: {
    name: String,
    relationship: String,
    phone: String
  },
  insurance: {
    provider_name: String,
    policy_number: String,
    group_number: String,
    coverage_start: Date,
    coverage_end: Date
  },
  allergies: [String],
  immunizations: [String],
  family_history: [String]
});

module.exports = mongoose.model('Patient', PatientSchema);
