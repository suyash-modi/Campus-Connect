import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ApplicantsPage() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/jobs/${id}/applications`);
        setApplicants(res.data);
        console.log("📥 Applicants fetched:", res.data);
      } catch (err) {
        console.error("❌ Error loading applicants:", err);
        alert("Failed to load applicants.");
      }
    };

    fetchApplicants();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Applicants</h1>
      {applicants.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul className="space-y-4">
          {applicants.map((app) => (
            <li key={app.id} className="p-4 border rounded">
              <p><strong>Name:</strong> {app.applicant?.name || "N/A"}</p>
              <p><strong>Email:</strong> {app.applicant?.email || "N/A"}</p>
              <p>
                <strong>Resume URL:</strong>{' '}
                {app.resumeUrl ? (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {app.resumeUrl}
                  </a>
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
