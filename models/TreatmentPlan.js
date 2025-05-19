// models/TreatmentPlan.js
const mongoose = require('mongoose');

const TreatmentPlanSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  created_at: { type: Date, default: Date.now },
  diagnosis: String,
  goals: [String],
  treatments: [{
    name: String,
    description: String,
    start_date: Date,
    end_date: Date,
    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed'],
      default: 'planned'
    }
  }],
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }, 
  notes: String
});

module.exports = mongoose.model('TreatmentPlan', TreatmentPlanSchema);
