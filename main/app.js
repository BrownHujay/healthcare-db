//app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/patients', require('../routes/PatientRoutes'));
app.use('/api/medical-records', require('../routes/MedicalRoutes'));
app.use('/api/queue', require('../routes/QueueRoutes'));
app.use('/api/treatment-plans', require('../routes/TreatmentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
