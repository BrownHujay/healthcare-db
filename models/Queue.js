// models/Queue.js
const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  reason: { type: String, required: true },
  checked_in_at: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed', 'cancelled'],
    default: 'waiting'
  },
  priority_level: {
    type: Number,
    enum: [1,2,3,4,5],
    default: 3
  },
  position: {
    type: Number,
    default: 9999 // High default number that will be updated by sorting
  }
});

module.exports = mongoose.model('Queue', QueueSchema);
