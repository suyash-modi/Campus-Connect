import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    companyName: ''
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const navigate = useNavigate();
  const locationRef = useRef(null);
  const companyRef = useRef(null);

  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch {
      localStorage.removeItem('token');
    }
  }

  useEffect(() => {
    fetchJobs();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target)) {
        setShowCompanySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchJobs = async (useFilters = false) => {
    try {
      let res;
      if (useFilters && (filters.title || filters.location || filters.companyName)) {
        const params = new URLSearchParams();
        if (filters.title) params.append('title', filters.title);
        if (filters.location) params.append('location', filters.location);
        if (filters.companyName) params.append('companyName', filters.companyName);
        
        res = await api.get(`/jobs/filter?${params.toString()}`);
      } else {
        res = await api.get('/jobs');
      }
      
      const allJobs = res.data;

      if (user?.role === 'COMPANY') {
        const myJobs = allJobs.filter((job) => {
          return job.postedBy?.email?.toLowerCase() === user.sub?.toLowerCase();
        });
        setJobs(myJobs);
      } else {
        setJobs(allJobs);
      }
    } catch (err) {
      alert('Error fetching jobs');
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [locationsRes, companiesRes] = await Promise.all([
        api.get('/jobs/locations'),
        api.get('/jobs/companies')
      ]);
      setLocations(locationsRes.data);
      setCompanies(companiesRes.data);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    // Show/hide suggestions based on input
    if (name === 'location') {
      setShowLocationSuggestions(value.length > 0);
    } else if (name === 'companyName') {
      setShowCompanySuggestions(value.length > 0);
    }
  };

  const handleSuggestionClick = (suggestion, field) => {
    setFilters(prev => ({
      ...prev,
      [field]: suggestion
    }));
    setShowLocationSuggestions(false);
    setShowCompanySuggestions(false);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setIsFiltering(true);
    fetchJobs(true);
    setShowLocationSuggestions(false);
    setShowCompanySuggestions(false);
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      location: '',
      companyName: ''
    });
    setIsFiltering(false);
    setShowLocationSuggestions(false);
    setShowCompanySuggestions(false);
    fetchJobs(false);
  };

  const handleOpenModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResumeUrl('');
    document.body.style.overflow = '';
  };

  const handleApply = async () => {
    try {
      await api.post(`/jobs/${selectedJob.id}/apply`, null, {
        params: { resumeUrl },
      });
      alert('Applied successfully!');
      handleCloseModal();
    } catch (err) {
      alert('Failed to apply');
    }
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/jobs/${jobId}/applications`);
  };

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(filters.location.toLowerCase())
  );

  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(filters.companyName.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      
      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Jobs</h2>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="e.g., Software Engineer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative" ref={locationRef}>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g., New York, NY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showLocationSuggestions && filteredLocations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredLocations.map((location, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(location, 'location')}
                  >
                    {location}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative" ref={companyRef}>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={filters.companyName}
              onChange={handleFilterChange}
              placeholder="e.g., Google"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showCompanySuggestions && filteredCompanies.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(company, 'companyName')}
                  >
                    {company}
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
        
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            onClick={handleFilterSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear Filters
          </button>
        </div>
        
        {isFiltering && (
          <div className="mt-3 text-sm text-gray-600">
            Showing filtered results for: 
            {filters.title && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">Title: {filters.title}</span>}
            {filters.location && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">Location: {filters.location}</span>}
            {filters.companyName && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">Company: {filters.companyName}</span>}
          </div>
        )}
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No jobs available.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border p-4 rounded shadow bg-white flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600 text-sm">{job.companyName}</p>
                <p className="text-gray-500 text-sm">{job.location}</p>
              </div>

              {user?.role === 'COMPANY' ? (
                <button
                  onClick={() => handleViewApplicants(job.id)}
                  className="btn btn-outline"
                >
                  View Applicants
                </button>
              ) : (
                <button
                  onClick={() => handleOpenModal(job)}
                  className="btn btn-outline btn-primary"
                >
                  View & Apply
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for Students */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="overflow-y-auto p-6 flex-1">
              <h2 className="text-xl font-bold mb-2">{selectedJob.companyName}</h2>
              <h3 className="text-lg font-semibold mb-2">{selectedJob.title}</h3>
              <p className="text-gray-700 mb-2">
                <strong>Description:</strong> {selectedJob.description}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Location:</strong> {selectedJob.location}
              </p>
              <textarea
                className="w-full border p-2 mb-4 rounded"
                rows="3"
                placeholder="Paste Resume URL (optional)"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
              />
            </div>

            <div className="border-t p-4 bg-white flex justify-end gap-3">
              <button className="btn btn-primary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
