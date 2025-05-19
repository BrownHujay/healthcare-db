const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { updateQueue } = require('../main/queueLogic');

// Create
router.post('/', async (req, res) => {
  try {
    const entry = new Queue(req.body);
    await entry.save();

    const sortedQueue = await updateQueue();

    res.status(201).json({
      message: 'Patient added to queue.',
      sortedQueue
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all
router.get('/', async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

// Get by ID
router.get('/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Not found' });
  res.json(patient);
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
});

module.exports = router;
