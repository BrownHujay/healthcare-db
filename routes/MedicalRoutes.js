const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');

// Create
router.post('/', async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get by Patient
router.get('/patient/:patientId', async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.params.patientId });
  res.json(records);
});

module.exports = router;
