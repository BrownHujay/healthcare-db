const Queue = require('../models/Queue');
const Patient = require('../models/Patient');

// priority_level: 1 = most urgent, 5 = least
const sortQueue = async () => {
  const queueEntries = await Queue.find({ status: 'waiting' })
    .populate('patient')
    .sort({ checked_in_at: 1 });

  // Split into level 1 and others
  const levelOne = [];
  const others = [];

  for (let entry of queueEntries) {
    if (entry.priority_level === 1) {
      levelOne.push(entry);
    } else {
      others.push(entry);
    }
  }

  // Sort both groups by check-in time and severity
  levelOne.sort((a, b) => new Date(a.checked_in_at) - new Date(b.checked_in_at));

  others.sort((a, b) => {
    if (a.priority_level !== b.priority_level) {
      return a.priority_level - b.priority_level;
    }
    return new Date(a.checked_in_at) - new Date(b.checked_in_at);
  });

  // lvl 1 always comes first
  const sortedQueue = [...levelOne, ...others];
  
  // Update positions in database
  const updatePromises = sortedQueue.map((entry, index) => {
    return Queue.findByIdAndUpdate(entry._id, { position: index + 1 }, { new: true });
  });
  
  await Promise.all(updatePromises);
  
  // Retrieve the updated queue with positions
  const updatedQueue = await Queue.find({ status: 'waiting' })
    .populate('patient')
    .sort({ position: 1 });
    
  return updatedQueue;
};

const updateQueue = async () => {
  const sortedQueue = await sortQueue();

  console.log('🔃 Sorted Queue (Level 1 always first):');
  sortedQueue.forEach((entry) => {
    console.log(`#${entry.position}: Patient ${entry.patient.first_name} ${entry.patient.last_name} | Priority ${entry.priority_level} | Checked in at ${entry.checked_in_at}`);
  });

  return sortedQueue;
};

module.exports = {
  sortQueue,
  updateQueue
};
