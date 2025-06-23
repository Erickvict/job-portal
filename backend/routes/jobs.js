
const express = require('express');
const router = express.Router();
const Job = require('../db'); // Now importing the Mongoose model

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a job
router.post('/', async (req, res) => {
  try {
    const {
      title, company, location, jobType,
      salaryMin, salaryMax, deadline, description
    } = req.body;

    const newJob = new Job({
      title,
      company,
      location,
      jobType,
      salaryMin,
      salaryMax,
      deadline,
      description
    });

    const savedJob = await newJob.save();
    res.json(savedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;