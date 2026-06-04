import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/SurveySubmissions.css';
import Navbar from './Navbar';

const SurveySubmissions = ({ decryptedSessions, saveDecryptedSession }) => {
    const { id: urlId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Use surveyId from URL or Location State
    const surveyId = urlId || location.state?.id;

    // Grab cached session info if it exists for this survey
    const sessionData = decryptedSessions[surveyId] || {};

    // State for statistics
    const [stats, setStats] = useState({ 
        classSize: 0, 
        submissions: 0, 
        pending: 0, 
        studentList: [] 
    });

    // Manage decrypted names in state so they can update automatically
    const [decryptedNames, setDecryptedNames] = useState(location.state?.names || sessionData.names || []);
    const [userKey, setUserKey] = useState(location.state?.userKey || sessionData.userKey || ""); // Store the key for polling
    const [isClosed, setIsClosed] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState(null);

    const formatSubmissionTimestamp = (timestampValue) => {
        if (!timestampValue) return 'Submission time unavailable';
        const date = new Date(timestampValue);
        if (Number.isNaN(date.getTime())) return 'Submission time unavailable';
        return `Submitted: ${date.toLocaleString()}`;
    };

    useEffect(() => {
        if (surveyId) {
            const fetchAndDecrypt = async () => {
                try {
                    // 1. Fetch basic stats (count, class size)
                    const statsRes = await fetch(`/api/survey/stats/${surveyId}`);
                    const statsData = await statsRes.json();
                    setStats(statsData);

                    if (statsData.status === 'closed') {
                        setIsClosed(true);
                    }

                    // 2. If we have a key, fetch and decrypt names automatically
                    if (userKey) {
                        const revealRes = await fetch('/api/survey/reveal', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ decryptionKey: userKey, surveyId })
                        });
                        const revealData = await revealRes.json();
                        if (revealData.success) {
                            setDecryptedNames(revealData.names);
                            
                            // Check to ensure we only update global state when data changes, preventing the loop
                            if (!sessionData.names || sessionData.names.length !== revealData.names.length) {
                                saveDecryptedSession(surveyId, {
                                    names: revealData.names,
                                    userKey: userKey
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error("Polling fetch error:", error);
                }
            };

            fetchAndDecrypt();
            const interval = setInterval(fetchAndDecrypt, 5000); // Update every 5 seconds
            return () => clearInterval(interval);
        }
    }, [surveyId, userKey, sessionData.names]);

    const handleDeleteSubmission = async (studentId) => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this student's submission?");
        if (!confirmDelete) return;

        setIsDeletingId(studentId);
        try {
            const response = await fetch(`/api/survey/submission/${studentId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const updatedNames = decryptedNames.filter(student => student.id !== studentId);
                setDecryptedNames(updatedNames);
                saveDecryptedSession(surveyId, { names: updatedNames, userKey });
                
                setStats(prev => ({
                    ...prev,
                    submissions: Math.max(0, prev.submissions - 1),
                    pending: prev.pending + 1
                }));
            } else {
                const errData = await response.json();
                alert(errData.error || "Failed to drop submission.");
            }
        } catch (error) {
            console.error("Error executing delete operations:", error);
            alert("Network error. Could not reach server endpoint.");
        } finally {
            setIsDeletingId(null);
        }
    };

    const confirmGenerateAndNavigate = async () => {
        // Navigates to the dashboard passing the latest decrypted names
        navigate(`/instructor/smart-teams/${surveyId}`, { state: { names: decryptedNames } });
    };

    return (
        <div className="instructor-page-shell">
            <Navbar surveyId={surveyId} />
            <div className="instructor-page-content">
            <div className="survey-page-wrapper">
                <div className="content-container">
                    <div className='question-container'>
                        <h1>{decryptedNames.length > 0 ? "Current Student List" : "Submission Status"}</h1>
                    </div>

                    <div className="results-layout">
                        {/* LEFT SIDE: The List */}
                        <div className="survey-card student-list-container" tabIndex="-1">
                            {decryptedNames.length > 0 ? (
                                <div className="student-grid">
                                    {decryptedNames.map((student, index) => (
                                        <div 
                                            key={student.id || index} 
                                            className="student-row-item"
                                            title={formatSubmissionTimestamp(student.created_at)}
                                        >
                                            <p className="student-name">
                                                <span className="name-number">{index + 1}.</span> 
                                                {student.name}
                                            </p>
                                            <button
                                                onClick={() => handleDeleteSubmission(student.id)}
                                                disabled={isDeletingId === student.id}
                                                className="student-delete-button"
                                                title="Delete Submission"
                                            >
                                                {isDeletingId === student.id ? "⏳" : "x"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="encrypted-submissions-message">
                                    <p>
                                        {stats.submissions} students have submitted, but names are encrypted.
                                    </p>
                                    <button 
                                        className="decrypt-button" 
                                        onClick={() => navigate(`/instructor/decrypt/${surveyId}`)}
                                    >
                                        Decrypt & View Names
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDE: The Stats */}
                        <div className="stats-card-sidebar">
                            <div className="stats-row">
                                <span>Class Size:</span> <strong>{stats.classSize}</strong>
                            </div>
                            <div className="stats-row">
                                <span>Submissions:</span> <strong>{stats.submissions}</strong>
                            </div>
                            <div className="stats-row">
                                <span>Pending:</span> <strong>{stats.pending}</strong>
                            </div>

                            <hr className="stats-divider" />

                            {isClosed && (
                                <div className="survey-closed-message">
                                    Survey Closed
                                </div>
                            )}

                            {decryptedNames.length > 0 && (
                                <button 
                                    className="generate-groups-btn" 
                                    onClick={confirmGenerateAndNavigate}
                                >
                                    Generate Groups
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="button-group survey-submissions-actions">
                        <button className="button" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default SurveySubmissions;