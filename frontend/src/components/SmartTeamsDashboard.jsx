import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import PurgeModal from "./PurgeModal";
import '../css/InstructorSetup.css'; 

const SmartTeamsDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Receiving names from the previous page state
    const students = location.state?.names || [];
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [isPurging, setIsPurging] = useState(false);
    const [surveyConfig, setSurveyConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availabilityMap, setAvailabilityMap] = useState({});

    // Helper function to get availability for a student
    const getStudentAvailability = (student) => {
        if (!student || !student.id) return [];
        // Use the student id directly as it's the numeric student_id from the database
        return availabilityMap[student.id] || [];
    };

    // Fetch survey configuration and availability data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/config/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSurveyConfig(data);
                }

                // Fetch availability data from the team generation endpoint
                const teamResponse = await fetch(`http://localhost:3001/api/teams/${id}`);
                if (teamResponse.ok) {
                    const teamData = await teamResponse.json();
                    if (teamData.availabilityMap) {
                        setAvailabilityMap(teamData.availabilityMap);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Basic logic to split students into groups of 4. This is a demo only!
    const groups = [];
    for (let i = 0; i < students.length; i += 4) {
        groups.push({
            number: (i / 4) + 1,
            members: students.slice(i, i + 4)
        });
    }

    // Function to handle the actual data deletion
    const handlePurge = async () => {
        setIsPurging(true);
        try {
            const response = await fetch(`http://localhost:3001/api/survey/purge/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setIsPurgeModalOpen(false);
                alert("All survey responses have been successfully erased from the database.");
                // After purging, we send the user back since the data is gone
                navigate(`/survey-submissions/${id}`, { state: { names: [] } });
            } else {
                alert("Failed to purge data. Please check your server connection.");
            }
        } catch (error) {
            console.error("Purge Error:", error);
            alert("An error occurred while attempting to erase the data.");
        } finally {
            setIsPurging(false);
        }
    };

    return (
        <>
            <Header variant="page" />
            
            <div className="survey-page-wrapper top-gap">
                <div className="content-container">
                    
                    <div className="header-flex" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1>Setting Up Smart Teams</h1>
                    </div>

                    {/* Survey Configuration Details */}
                    {surveyConfig && (
                        <div className="question-container" style={{ marginBottom: '30px' }}>
                            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Survey Configuration</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                <div style={{ padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px', fontWeight: '500' }}>Class Name</p>
                                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{surveyConfig.courseName || 'N/A'}</p>
                                </div>
                                <div style={{ padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px', fontWeight: '500' }}>Total Submissions</p>
                                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{students.length}</p>
                                </div>
                                <div style={{ padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px', fontWeight: '500' }}>Group Size</p>
                                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{surveyConfig.limitType || 'Maximum'}: {surveyConfig.maxSize || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="header-flex" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2>Generated Groups</h2>
                    </div>

                    <div className="results-layout">
                        {/* LEFT SIDE: teams grid */}
                        <div className="student-groups-container">
                            <div className="groups-grid" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr', 
                                gap: '20px', 
                                width: '100%' 
                            }}>
                                {groups.map((group) => (
                                    <div key={group.number} className="group-card">
                                        <div className="group-header">
                                            <span>Group #{group.number}</span>
                                        </div>
                                        <div className="group-body">
                                            <div className="group-table-header">
                                                <div className="group-table-cell">#</div>
                                                <div className="group-table-cell">Name</div>
                                                <div className="group-table-cell">Gender</div>
                                                <div className="group-table-cell">GPA</div>
                                                <div className="group-table-cell">Availability</div>
                                            </div>
                                            {group.members.map((student, idx) => {
                                                const availability = getStudentAvailability(student);
                                                const availabilityText = availability.length > 0 
                                                    ? availability.slice(0, 2).join(', ') + (availability.length > 2 ? '...' : '')
                                                    : 'N/A';
                                                return (
                                                    <div key={idx} className="group-table-row">
                                                        <div className="group-table-cell">{idx + 1}</div>
                                                        <div className="group-table-cell">{student.name}</div>
                                                        <div className="group-table-cell">{student.gender}</div>
                                                        <div className="group-table-cell">{student.gpa ? student.gpa.toFixed(2) : 'N/A'}</div>
                                                        <div className="group-table-cell" title={availability.join(', ')}>{availabilityText}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDE: Using the stats sidebar container for action buttons */}
                        <div className="stats-card-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '100px', alignItems: 'center' }}>
                            {/* <button className="sidebar-btn" title="Export" style={{ padding: '12px', width: '100%' }}>
                                <span className="icon">Share 📤</span>
                            </button> */}
                            {/* <button className="sidebar-btn" title="Reshuffle" style={{ padding: '12px', width: '100%' }}>
                                <span className="icon">Shuffle 🔄</span> 
                            </button> */}
                            <button 
                                className="sidebar-btn trash-btn" 
                                onClick={() => setIsPurgeModalOpen(true)}
                                title="Purge Data"
                                style={{ padding: '12px', width: '100%' }}
                            >
                                <span className="icon">Purge 🗑️</span>
                            </button>
                        </div>
                    </div>

                    <div className="button-tray" style={{ marginTop: '40px', textAlign: 'center' }}>
                        <button className="button" onClick={() => navigate(-1)}>
                            Back to Submissions
                        </button>
                    </div>
                </div>
            </div>

            <PurgeModal 
                isOpen={isPurgeModalOpen}
                onClose={() => setIsPurgeModalOpen(false)}
                onConfirm={handlePurge}
                isLoading={isPurging}
            />
        </>
    );
};

export default SmartTeamsDashboard;