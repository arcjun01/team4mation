import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/SurveySubmissions.css';

const SurveySubmissions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const decryptedNames = location.state?.names || [];

    const [stats, setStats] = useState({ 
        classSize: 0, 
        submissions: 0, 
        pending: 0, 
        studentList: [] 
    });

    useEffect(() => {
        fetch(`http://localhost:3001/api/survey/stats/${id}`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Error fetching stats:", err));
    }, [id]);

    const namesToDisplay =
        decryptedNames.length > 0 ? decryptedNames : stats.studentList;

    return (
        <div className="page-wrapper">

            <div className="top-navbar">
                <div className="logo-box">
                   <img src="/path-to-your-logo.png" alt="Team4mation" />
                </div>
            </div>

            <div className="main-viewport">
                <div className="content-container">

                    <div className="title-card">
                        <h1>Survey Submissions</h1>
                    </div>

                    <div className="data-card">

                        <div className="student-grid">
                            {namesToDisplay.length > 0 ? (
                                namesToDisplay.map((name, index) => (
                                    <p key={index} className="student-name">
                                        <span className="name-number">{index + 1}.</span> {name}
                                    </p>
                                ))
                            ) : (
                                <p>No names to display. Please decrypt first.</p>
                            )}
                        </div>

                        <div className="stats-sidebar">
                            <div className="stats-row">
                                <span>Class Size:</span> <strong>{stats.classSize}</strong>
                            </div>

                            <div className="stats-row">
                                <span>Submissions:</span> <strong>{stats.submissions}</strong>
                            </div>

                            <div className="stats-row">
                                <span>Pending:</span> <strong>{stats.pending}</strong>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="button-tray">
                    <button className="nav-btn" onClick={() => navigate(-1)}>
                        Back to Survey Link
                    </button>

                    <button className="nav-btn close-btn" onClick={() => navigate('/')}>
                        Close Survey
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveySubmissions;