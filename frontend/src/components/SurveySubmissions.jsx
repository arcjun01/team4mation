import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/SurveySubmissions.css';

const SurveySubmissions = () => {
    const { id: urlId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Names passed back after the instructor enters the decryption key
    const decryptedResults = location.state?.names || [];
    const surveyId = urlId || location.state?.id;

    const [stats, setStats] = useState({ 
        classSize: 0, 
        submissions: 0, 
        pending: 0, 
        studentList: [] 
    });

    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
    if (surveyId) {
        fetch(`http://localhost:3001/api/survey/stats/${surveyId}`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                // Set the initial UI state based on the DB status
                if (data.status === 'closed') {
                    setIsClosed(true);
                }
            })
            .catch(err => console.error("Stats fetch error:", err));
        }
    }, [surveyId]);

    const handleCloseSurvey = async () => {
    if (window.confirm("Stop all new submissions? Students will no longer be able to access the link.")) {
        try {
            const response = await fetch(`http://localhost:3001/api/survey/close/${surveyId}`, {
                method: 'PATCH'
            });

            if (response.ok) {
                setIsClosed(true); // Updates the UI
            }
        } catch (error) {
            alert("Error closing survey. Check your connection.");
        }
    }
};

    return (
        <div className="page-wrapper">
            <div className="main-viewport">
                <div className="content-container">
                    <div className="title-card">
                        <h1>{decryptedResults.length > 0 ? "Current Student List" : "Submission Status"}</h1>
                    </div>

                    <div className="results-layout">
                        {/* LEFT SIDE: The List */}
                        <div className="survey-card student-list-container">
                            <div className="student-grid">
                                {decryptedResults.length > 0 ? (
                                    decryptedResults.map((student, index) => (
                                        <p key={index} className="student-name">
                                            <span className="name-number">{index + 1}.</span> 
                                            {student.name}
                                        </p>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <p style={{ color: '#666', marginBottom: '15px' }}>
                                            {stats.submissions} students have submitted, but names are encrypted.
                                        </p>
                                        <button 
                                            className="button" 
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

                            {/* CLOSE BUTTON: Always visible unless already closed */}
                            {!isClosed ? (
                                <button 
                                    className="close-survey-btn" 
                                    onClick={handleCloseSurvey}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        backgroundColor: '#ff8a65', 
                                        color: 'white',
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close Survey
                                </button>
                            ) : (
                                <div style={{ color: '#d32f2f', fontWeight: 'bold', textAlign: 'center' }}>
                                    Survey Closed
                                </div>
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
        </div>
    );
};

export default SurveySubmissions;