import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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
  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
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
  fetchJobs();
}, []);



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

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border p-4 rounded shadow bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600 text-sm">{job.companyName}</p>
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
