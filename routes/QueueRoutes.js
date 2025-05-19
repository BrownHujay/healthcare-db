const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const { sortQueue, updateQueue } = require('../main/queueLogic');

// Add to queue
router.post('/', async (req, res) => {
  try {
    const entry = new Queue(req.body);
    await entry.save();
    
    const sortedQueue = await sortQueue();
    
    res.status(201).json({
      newEntry: entry,
      sortedQueue: sortedQueue
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all queued patients
router.get('/', async (req, res) => {
  const queue = await Queue.find().populate('patient').sort({ position: 1 });
  res.json(queue);
});

// Trigger manual sort and update database
router.post('/sorted', async (req, res) => {
  try {
    const sortedQueue = await sortQueue();
    
    // Update the main database with the sorted queue
    const updatedQueue = await updateQueue();
    
    res.json({
      message: 'Queue sorted and database updated',
      queue: sortedQueue
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sort queue: ' + err.message });
  }
});

// Update status
router.put('/:id', async (req, res) => {
  try {
    const updated = await Queue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // If status changed, we might need to re-sort the queue
    if (req.body.status || req.body.priority_level) {
      await sortQueue();
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Queue.findByIdAndDelete(req.params.id);
    
    // Re-sort the queue after deletion
    await sortQueue();
    
    res.json({ message: 'Entry deleted and queue re-sorted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
