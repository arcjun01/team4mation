import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import '../css/InstructorFormDetails.css';

const normalizeLimitType = (limitType) => {
  if (!limitType) return 'Maximum';
  return limitType.toLowerCase() === 'minimum' || limitType.toLowerCase() === 'min'
    ? 'Minimum'
    : 'Maximum';
};

const InstructorFormDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formConfig, setFormConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const [configResponse, statsResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/config/${id}`),
          fetch(`http://localhost:3001/api/survey/stats/${id}`)
        ]);

        if (!configResponse.ok) {
          throw new Error('Unable to load form details.');
        }

        const configData = await configResponse.json();
        const statsData = statsResponse.ok ? await statsResponse.json() : null;

        setFormConfig(configData);
        setStats(statsData);
      } catch (fetchError) {
        console.error('Error loading form details:', fetchError);
        setError('Unable to load the saved form details right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormDetails();
  }, [id]);

  const surveyUrl = `${window.location.origin}/team4mation/survey/${id}`;
  const prerequisiteCourse = formConfig?.prevCourse?.trim();
  const isPrerequisiteRequired =
    Boolean(prerequisiteCourse) && prerequisiteCourse.toLowerCase() !== 'not required';

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="instructor-page-shell">
      <Navbar surveyId={id} />

      <div className="instructor-page-content">
        <div className="content-container">
          <div className="question-container">
            <h1>Form Details</h1>
          </div>

          {loading ? (
            <div className="question-container">
              <p>Loading saved form details...</p>
            </div>
          ) : error ? (
            <div className="question-container">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <section className="form-details-grid" aria-label="Saved form settings">
                <div className="form-detail-card">
                  <span className="form-detail-label">Course Name</span>
                  <span className="form-detail-value">{formConfig?.courseName || 'N/A'}</span>
                </div>
                <div className="form-detail-card">
                  <span className="form-detail-label">Team Size Rule</span>
                  <span className="form-detail-value">
                    {normalizeLimitType(formConfig?.limitType)}: {formConfig?.maxSize || 'N/A'}
                  </span>
                </div>
                <div className="form-detail-card">
                  <span className="form-detail-label">Class Size</span>
                  <span className="form-detail-value">{stats?.classSize ?? 'N/A'}</span>
                </div>
                <div className="form-detail-card">
                  <span className="form-detail-label">Prerequisite Course</span>
                  <span className="form-detail-value">{formConfig?.prevCourse || 'Not required'}</span>
                </div>
                {isPrerequisiteRequired && (
                  <div className="form-detail-card">
                    <span className="form-detail-label">Uses GPA</span>
                    <span className="form-detail-value">{formConfig?.useGpa ? 'Yes' : 'No'}</span>
                  </div>
                )}
                <div className="form-detail-card full-width">
                  <span className="form-detail-label">Student Survey Link</span>
                  <a
                    href={surveyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="form-detail-link"
                  >
                    Open Survey
                  </a>
                </div>
              </section>

              <div className="button-group instructor-form-actions">
                <button className="button" onClick={() => navigate(`/generate-link/${id}`)}>
                  View Survey Link
                </button>
                <button className="button" onClick={() => navigate(`/survey-submissions/${id}`)}>
                  Go to Student Status
                </button>
                <button className="button" onClick={handleGoBack}>
                  Go Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorFormDetails;
