import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        alert('Error fetching job');
        navigate('/');
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async () => {
    try {
      await api.post(`/jobs/${id}/apply`, null, {
        params: { resumeUrl }
      });
      alert('Applied successfully!');
      setApplied(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (!job) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
        <p className="text-gray-600 mb-1">
          <strong>Company:</strong> {job.companyName}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Location:</strong> {job.location}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Description:</strong> {job.description}
        </p>
        {job.postedBy && (
          <p className="text-gray-600 mb-4">
            <strong>Posted by:</strong> {job.postedBy.name} ({job.postedBy.email})
          </p>
        )}

        {applied ? (
          <p className="text-green-600 font-semibold">You have already applied!</p>
        ) : showForm ? (
          <>
            <input
              type="text"
              placeholder="Resume URL (optional)"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              className="input w-full mb-3"
            />
            <button onClick={handleApply} className="btn btn-primary">
              Submit Application
            </button>
          </>
        ) : (
          <button onClick={() => setShowForm(true)} className="btn btn-outline">
            Apply to this Job
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplyJob;
