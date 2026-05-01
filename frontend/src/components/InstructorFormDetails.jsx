import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import PurgeModal from './PurgeModal';
import '../css/InstructorFormDetails.css';
import copyIcon from '../assets/CopyIcon.svg';
import editIcon from '../assets/EditIcon.svg';
import deleteIcon from '../assets/DeleteIcon.svg';
import linkIcon from '../assets/LinkIcon.svg';
import activityIcon from '../assets/ActivityIcon.svg';

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
  const [isPurging, setIsPurging] = useState(false);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const [configResponse, statsResponse] = await Promise.all([
          fetch(`/api/config/${id}`),
          fetch(`/api/survey/stats/${id}`)
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

  const courseName = formConfig?.courseName || formConfig?.course_name || '';
  const teamLimit = formConfig?.maxSize || formConfig?.team_limit || '';
  const limitType = normalizeLimitType(formConfig?.limitType || formConfig?.limit_type);
  const prevCourse = formConfig?.prevCourse || formConfig?.prev_course || '';
  const classSize = stats?.classSize || formConfig?.classSize || formConfig?.class_size || '';
  const useGpa = Boolean(
    formConfig?.useGpa ?? formConfig?.use_gpa
  );
  const hasGeneratedGroups = ['closed', 'formed'].includes((stats?.status || '').toLowerCase());

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEditSurvey = () => {
    navigate('/setup', {
      state: {
        formData: {
          courseName,
          classSize,
          teamLimit: String(teamLimit || ''),
          limitType,
          prevCourse,
          useGpa
        }
      }
    });
  };

  const handlePurgeSurvey = async () => {
    setIsPurging(true);
    try {
      const response = await fetch(`http://localhost:3001/api/survey/purge/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setIsPurgeModalOpen(false);
        window.alert('All survey responses have been successfully erased from the database.');
        navigate('/');
      } else {
        window.alert('Failed to purge data. Please check your server connection.');
      }
    } catch (purgeError) {
      console.error('Error purging survey:', purgeError);
      window.alert('An error occurred while attempting to erase the data.');
    } finally {
      setIsPurging(false);
    }
  };

  const handleCopySurveyLink = async () => {
    const surveyUrl = `${window.location.origin}/team4mation/survey/${id}`;
    try {
      await navigator.clipboard.writeText(surveyUrl);
      window.alert('Student survey link copied to clipboard.');
    } catch (copyError) {
      console.error('Failed to copy survey link:', copyError);
      window.alert('Unable to copy link automatically. Please copy it from the link page.');
    }
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
              <div className="form-details-main-layout">
                <section className="form-details-grid" aria-label="Saved form settings">
                  <div className="form-detail-card">
                    <span className="form-detail-label">Course Name</span>
                    <span className="form-detail-value">{courseName || 'N/A'}</span>
                  </div>
                  <div className="form-detail-card">
                    <span className="form-detail-label">Team Size Rule</span>
                    <span className="form-detail-value">
                      {limitType}: {teamLimit || 'N/A'}
                    </span>
                  </div>
                  <div className="form-detail-card">
                    <span className="form-detail-label">Class Size</span>
                    <span className="form-detail-value">{classSize || 'N/A'}</span>
                  </div>
                  <div className="form-detail-card">
                    <span className="form-detail-label">Prerequisite Course</span>
                    <span className="form-detail-value">{prevCourse || 'Not required'}</span>
                  </div>
                  {hasGeneratedGroups ? (
                    <div className="form-detail-card full-width">
                      <span className="form-detail-label">Formed Groups</span>
                      <button
                        type="button"
                        className="form-detail-link form-detail-link-button"
                        onClick={() => navigate(`/instructor/smart-teams/${id}`)}
                      >
                        View Results
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="form-detail-card">
                        <span className="form-detail-label form-detail-label-with-icon">
                          <img src={linkIcon} alt="" className="form-detail-label-icon" />
                          Link to the Student Survey
                        </span>
                        <button
                          type="button"
                          className="form-detail-link form-detail-link-button"
                          onClick={() => navigate(`/generate-link/${id}`)}
                        >
                          View Link
                        </button>
                      </div>
                      <div className="form-detail-card">
                        <span className="form-detail-label form-detail-label-with-icon">
                          <img src={activityIcon} alt="" className="form-detail-label-icon" />
                          Survey Submission Status
                        </span>
                        <button
                          type="button"
                          className="form-detail-link form-detail-link-button"
                          onClick={() => navigate(`/survey-submissions/${id}`)}
                        >
                          View Submissions
                        </button>
                      </div>
                    </>
                  )}
                </section>

                <aside className="form-actions-rail" aria-label="Form actions">
                  <button
                    type="button"
                    className="form-actions-rail-button"
                    onClick={handleCopySurveyLink}
                    title="Copy Student Survey Link"
                    aria-label="Copy Student Survey Link"
                  >
                    <img src={copyIcon} alt="" />
                  </button>
                  <button
                    type="button"
                    className="form-actions-rail-button"
                    onClick={handleEditSurvey}
                    title={hasGeneratedGroups ? 'Editing disabled after groups are formed' : 'Edit Survey'}
                    aria-label="Edit Survey"
                    disabled={hasGeneratedGroups}
                  >
                    <img src={editIcon} alt="" />
                  </button>
                  <button
                    type="button"
                    className="form-actions-rail-button"
                    onClick={() => setIsPurgeModalOpen(true)}
                    title="Delete Survey"
                    aria-label="Delete Survey"
                    disabled={isPurging}
                  >
                    <img src={deleteIcon} alt="" />
                  </button>
                </aside>
              </div>

              <div className="button-group instructor-form-actions">
                <div className="instructor-form-actions-right">
                  <button className="button go-back-button" onClick={handleGoBack}>
                    Go Back
                  </button>
                </div>
              </div>

              <PurgeModal
                isOpen={isPurgeModalOpen}
                onClose={() => setIsPurgeModalOpen(false)}
                onConfirm={handlePurgeSurvey}
                isLoading={isPurging}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorFormDetails;
