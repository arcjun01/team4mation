import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/SurveySubmissions.css';
import Header from './Header';

const SurveySubmissions = () => {
    const { id: urlId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Use surveyId from URL or Location State
    const surveyId = urlId || location.state?.id;

    // State for statistics
    const [stats, setStats] = useState({ 
        classSize: 0, 
        submissions: 0, 
        pending: 0, 
        studentList: [] 
    });

    const [isClosed, setIsClosed] = useState(false);
    
    // Manage decrypted names in state so they can update automatically
    const [decryptedNames, setDecryptedNames] = useState(location.state?.names || []);
    const [userKey, setUserKey] = useState(location.state?.userKey || ""); // Store the key for polling

    useEffect(() => {
        if (surveyId) {
            const fetchAndDecrypt = async () => {
                try {
                    // 1. Fetch basic stats (count, class size)
                    const statsRes = await fetch(`http://localhost:3001/api/survey/stats/${surveyId}`);
                    const statsData = await statsRes.json();
                    setStats(statsData);

                    // Update UI if survey is closed
                    if (statsData.status === 'closed') {
                        setIsClosed(true);
                    }

                    // 2. If we have a key, fetch and decrypt names automatically
                    if (userKey) {
                        const revealRes = await fetch('http://localhost:3001/api/survey/reveal', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ decryptionKey: userKey, surveyId })
                        });
                        const revealData = await revealRes.json();
                        if (revealData.success) {
                            setDecryptedNames(revealData.names);
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
    }, [surveyId, userKey]);

    const handleCloseSurvey = async () => {
        if (window.confirm("Stop all new submissions? Students will no longer be able to access the link.")) {
            try {
                const response = await fetch(`http://localhost:3001/api/survey/close/${surveyId}`, {
                    method: 'PATCH'
                });

                if (response.ok) {
                    setIsClosed(true);
                }
            } catch (error) {
                alert("Error closing survey. Check your connection.");
            }
        }
    };

    const confirmGenerateAndNavigate = () => {
        // Navigates to the dashboard passing the latest decrypted names
        navigate(`/instructor/smart-teams/${surveyId}`, { state: { names: decryptedNames } });
    };

    return (
        <>
            <Header variant="page" />
            <div className="survey-page-wrapper top-gap">
                <div className="content-container">
                    <div className='question-container'>
                        <h1>{decryptedNames.length > 0 ? "Current Student List" : "Submission Status"}</h1>
                    </div>

                    <div className="results-layout">
                        {/* LEFT SIDE: The List */}
                        <div className="survey-card student-list-container">
                            <div className="student-grid">
                                {decryptedNames.length > 0 ? (
                                    decryptedNames.map((student, index) => (
                                        <p key={index} className="student-name">
                                            <span className="name-number">{index + 1}.</span> 
                                            {student.name}
                                        </p>
                                    ))
                                ) : (
                                    <div className="student-name" style={{ textAlign: 'center', padding: '20px' }}>
                                        <p style={{ color: '#666', marginBottom: '15px' }}>
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

                            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

                            {isClosed && (
                                <div style={{ color: '#d32f2f', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
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

                    <div className="button-tray" style={{ marginTop: '30px' }}>
                        <button className="button" onClick={() => navigate(`/generate-link/${surveyId}`)}>
                            Back to Link
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SurveySubmissions;