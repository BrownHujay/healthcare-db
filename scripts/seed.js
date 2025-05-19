// scripts/seed.js

//ChatGPT code. I was not going to manually fill 70 patients with 50 data points each.
require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const Patient = require('../models/Patient');
const Queue = require('../models/Queue');
const MedicalRecord = require('../models/MedicalRecord');
const TreatmentPlan = require('../models/TreatmentPlan');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  }
};

const seedData = async (count = 20) => {
  await connectDB();

  // Clear old data
  await Promise.all([
    Patient.deleteMany({}),
    Queue.deleteMany({}),
    MedicalRecord.deleteMany({}),
    TreatmentPlan.deleteMany({})
  ]);

  const patients = [];

  for (let i = 0; i < count; i++) {
    const patient = await Patient.create({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      dob: faker.date.birthdate(),
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode()
      },
      emergency_contact: {
        name: faker.person.fullName(),
        relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
        phone: faker.phone.number()
      },
      insurance: {
        provider_name: faker.company.name(),
        policy_number: faker.string.uuid(),
        group_number: faker.finance.accountNumber(),
        coverage_start: faker.date.past(),
        coverage_end: faker.date.future()
      },
      allergies: faker.helpers.arrayElements(['Peanuts', 'Pollen', 'Latex', 'Shellfish'], 2),
      immunizations: faker.helpers.arrayElements(['MMR', 'Tetanus', 'Covid-19', 'Flu'], 2),
      family_history: faker.helpers.arrayElements(['Diabetes', 'Heart Disease', 'Cancer'], 2)
    });

    patients.push(patient);

    // Create queue entry
    await Queue.create({
      patient: patient._id,
      reason: faker.lorem.sentence(),
      checked_in_at: faker.date.recent(),
      status: 'waiting',
      priority_level: faker.number.int({ min: 1, max: 5 })
    });

    // Create medical record
    await MedicalRecord.create({
      patient: patient._id,
      visit_date: faker.date.past(),
      diagnosis: faker.lorem.words(3),
      notes: faker.lorem.paragraph(),
      prescriptions: [faker.commerce.product()],
      lab_results: [
        {
          test_name: 'CBC',
          result: faker.helpers.arrayElement(['Normal', 'Low', 'High']),
          unit: '',
          normal_range: 'N/A'
        }
      ]
    });

    // Create treatment plan
    await TreatmentPlan.create({
      patient: patient._id,
      created_at: faker.date.recent(),
      diagnosis: faker.lorem.words(2),
      procedures: [faker.lorem.word()],
      medications: [faker.commerce.product()],
      follow_up_date: faker.date.future(),
      status: faker.helpers.arrayElement(['active', 'completed', 'cancelled'])
    });
  }

  console.log(`✅ Seeded ${count} patients with queue, medical records, and treatment plans`);
  process.exit(0);
};

seedData(35);
