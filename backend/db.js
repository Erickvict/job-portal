
const mongoose = require('mongoose');

// Define Job Schema
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  jobType: String,
  salaryMin: Number,
  salaryMax: Number,
  deadline: Date,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

// Create Job model
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;