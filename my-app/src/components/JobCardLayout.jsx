import React, { useState, useEffect } from 'react';
import './JobCardLayout.css';
import './NavbarAndFilter.css';
import logo from '../logo.png'
import { IoLocationOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { RiBuildingLine } from "react-icons/ri";
import { RiStackLine } from "react-icons/ri";
import axios from 'axios';
import amaz from '../amazon.png'


const JobCard = ({ job }) => (
  <div className="job-card">
    <div className="card-header">
      <img src={amaz} style={{ height: "60px", width: "60px" }} alt={job.company} className="company-logo" />
      <button className="btn">24h ago</button>
    </div>
    <h2 className="job-title">{job.title}</h2>
   <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
  {/* Experience */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <BsFillPersonPlusFill style={{ fontSize: '16px' }} />
    <span>{job?.exp || '1-3 yr'}</span>
  </div>

  {/* Work Mode */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <RiBuildingLine style={{ fontSize: '16px' }} />
    <span>{job?.mode || 'Onsite'}</span>
  </div>

  {/* Salary */}
  {job?.salaryMax && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <RiStackLine style={{ fontSize: '16px' }} />
      <span>₹{job.salaryMax.toLocaleString('en-IN')}</span>
    </div>
  )}
</div>
    <ul className="description">
      <li>{job.description?.split('.')[0] || 'A user-friendly interface lets you browse'}</li>
    </ul>
    <button className="apply-btn">Apply Now</button>
  </div>
);

const JobCardLayout = () => {

  // Reuse styles
  const inputStyle = {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    border: 'none'
  };

  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    description: '',
  });


const apiBaseUrl = import.meta.env.PROD 
  ? '/api' // When deployed to Vercel
  : 'http://localhost:5000/api';






  // FETCH JOBS ON LOAD
  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/jobs`);
      
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
        setJobs([]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      
      
      if (err.response) {
        console.error('Server responded with:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Request setup error:', err.message);
      }
      setJobs([]);
    }
  };

  fetchJobs();
}, []);


  // 👇 HANDLE PUBLISH TO BACKEND
  const handlePublish = async () => {
  try {
    const response = await axios.post(`${apiBaseUrl}/api/jobs`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Axios automatically parses JSON responses
    const newJob = response.data;
    
    setJobs([newJob, ...jobs]);
    setShowModal(false);
    setFormData({
      title: '',
      company: '',
      location: '',
      jobType: '',
      salaryMin: '',
      salaryMax: '',
      deadline: '',
      description: '',
    });

  } catch (err) {
    console.error('Error creating job:', err);
    
    // Enhanced error handling
    if (err.response) {
      // Server responded with a status code outside 2xx range
      console.error('Response data:', err.response.data);
      console.error('Status code:', err.response.status);
      alert(`Error: ${err.response.data.message || 'Failed to create job'}`);
    } else if (err.request) {
      // Request was made but no response received
      console.error('No response received:', err.request);
      alert('Network error - please check your connection');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', err.message);
      alert('Application error - please try again');
    }
  }
};

  return (
    <div className="container">
      {/* Filter Bar */}
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li>Home</li>
          <li>Find Jobs</li>
          <li>Find Talents</li>
          <li>About us</li>
          <li>Testimonials</li>
        </ul>
        <span
          onClick={() => setShowModal(true)}
          className='create-job-btn'
        >
          Create One
        </span>
      </nav>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Search Field */}
        <div className="filter-field">
          <IoIosSearch className="input-icon" />
          <input
            type="text"
            className="filter-input with-icon"
            placeholder="Search By Job Title, Role"
          />
        </div>

        {/* Location Field */}
        <div className="filter-field">
          <IoLocationOutline className="input-icon" />
          <select className="filter-select with-icon">
            <option>Preferred Location</option>
            <option>Chennai</option>
            <option>Bangalore</option>
          </select>
        </div>

        {/* Job Type Field */}
        <div className="filter-field">
          <BsFillPersonPlusFill className="input-icon" />
          <select className="filter-select with-icon">
            <option>Job type</option>
            <option>Part-time</option>
            <option>Full-time</option>
          </select>
        </div>

        {/* Salary Slider */}
        <div className="salary-field">
          <div className="salary-label">Salary Per Month</div>
          <div className="slider-container">
            <input
              type="range"
              min="50000"
              max="80000"
              className="salary-slider"
            />
          </div>
          <span>₹50k - ₹80k</span>
        </div>
      </div>


      {/* Job Cards */}
      <div className="grid">

        {jobs.map((job, i) => (
          <JobCard key={i} job={job} />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '25px',
            width: '100%',
            maxWidth: '600px',
            boxSizing: 'border-box'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
              textAlign: 'center'
            }}>Create Job Opening</h2>

            {/* Job Title & Company Name Row */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#444'
                }}>Job Title</h3>
                <input
                  placeholder="Full Stack Developer"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#444'
                }}>Company Name</h3>
                <input
                  placeholder="Amazon, Microsoft, Swiggy"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Location & Job Type Row */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#444'
                }}>Location</h3>
                <select
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="">Choose preferred location</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#444'
                }}>Job Type</h3>
                <select
                  value={formData.jobType}
                  onChange={e => setFormData({ ...formData, jobType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="">Job Type</option>
                  <option value="FullTime">FullTime</option>
                  <option value="PartTime">PartTime</option>
                </select>
              </div>
            </div>

            {/* Salary Range & Application Deadline Row */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#444'
                }}>Salary Range</h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <input
                    placeholder="Min"
                    value={formData.salaryMin}
                    onChange={e => setFormData({ ...formData, salaryMin: e.target.value })}
                    style={{
                      width: '130px', // Reduced width
                      padding: '10px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    placeholder="Max"
                    value={formData.salaryMax}
                    onChange={e => setFormData({ ...formData, salaryMax: e.target.value })}
                    style={{
                      width: '130px', // Reduced width
                      padding: '10px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#444'
                }}>Application Deadline</h3>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            {/* Job Description */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontWeight: '500',
                color: '#444'
              }}>Job Description</h3>
              <textarea
                placeholder="Please share a description to let the candidate know more about the job role."
                rows={5}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              borderTop: '1px solid #eee',
              paddingTop: '20px'
            }}>
              <button
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  color: '#666',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => setShowModal(false)}
              >
                Save Draft
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: '1px solid #3b82f6',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={handlePublish}
              >
                Publish →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reuse styles
const inputStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  width: '100%',
  boxSizing: 'border-box'
};

const buttonStyle = {
  padding: '12px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  border: 'none'
};

export default JobCardLayout;
