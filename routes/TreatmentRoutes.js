const express = require('express');
const router = express.Router();
const TreatmentPlan = require('../models/TreatmentPlan');

// Create
router.post('/', async (req, res) => {
  try {
    const plan = new TreatmentPlan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get plans by patient
router.get('/patient/:patientId', async (req, res) => {
  const plans = await TreatmentPlan.find({ patient: req.params.patientId });
  res.json(plans);
});

// Update a treatment plan
router.put('/:id', async (req, res) => {
  const updated = await TreatmentPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;
