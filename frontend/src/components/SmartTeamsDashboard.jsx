import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import PurgeModal from "./PurgeModal";
import '../css/InstructorSetup.css'; 

const SmartTeamsDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // State for submissions and teams
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [surveyConfig, setSurveyConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availabilityMap, setAvailabilityMap] = useState({});
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [isPurging, setIsPurging] = useState(false);

    // Helper function to get availability for a student
    const getStudentAvailability = (student) => {
        if (!student || !student.student_id) return [];
        return availabilityMap[student.student_id] || [];
    };

    // Fetch survey configuration, students, and generate teams
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // 1. Fetch survey configuration
                const configResponse = await fetch(`http://localhost:3001/api/config/${id}`);
                if (configResponse.ok) {
                    const configData = await configResponse.json();
                    setSurveyConfig(configData);
                }

                // 2. Fetch student submissions and availability
                const submissionsResponse = await fetch(`http://localhost:3001/api/surveys/${id}/submissions`);
                if (!submissionsResponse.ok) {
                    throw new Error('Failed to fetch student submissions');
                }
                
                const submissionsData = await submissionsResponse.json();
                setStudents(submissionsData.students || []);
                setAvailabilityMap(submissionsData.availabilityMap || {});

                // 3. Fetch grouped teams data
                const teamsResponse = await fetch(`http://localhost:3001/api/teams/${id}`);
                if (teamsResponse.ok) {
                    const teamsData = await teamsResponse.json();
                    if (teamsData.groups && teamsData.groups.length > 0) {
                        setGroups(teamsData.groups);
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError('Failed to load survey data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

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

    if (loading) {
        return (
            <>
                <Header variant="page" />
                <div className="survey-page-wrapper top-gap">
                    <div className="main-container">
                        <div className="content-container">
                            <div className="question-container">
                                <h1>Loading Smart Teams...</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header variant="page" />
                <div className="survey-page-wrapper top-gap">
                    <div className="main-container">
                        <div className="content-container">
                            <div className="question-container">
                                <h1>Error Loading Survey</h1>
                                <p style={{color: 'red'}}>{error}</p>
                                <button className="button" onClick={() => navigate('/view-surveys')}>
                                    Back to Surveys
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header variant="page" />
            
            <div className="survey-page-wrapper top-gap">
                <div className="main-container">
                    <div className="content-container">
                        
                        <div className="question-container">
                            <h1>Setting Up Smart Teams</h1>
                        </div>

                        {/* Survey Configuration Details */}
                        {surveyConfig && (
                            <div className="question-container smart-teams-config-section">
                                <div className="config-grid">
                                    <div className="config-box">
                                        <p className="config-label">Class Name</p>
                                        <p className="config-value">{surveyConfig.courseName || 'N/A'}</p>
                                    </div>
                                    <div className="config-box">
                                        <p className="config-label">Total Submissions</p>
                                        <p className="config-value">{students.length}</p>
                                    </div>
                                    <div className="config-box">
                                        <p className="config-label">Group Size</p>
                                        <p className="config-value">{surveyConfig.limitType || 'Maximum'}: {surveyConfig.maxSize || surveyConfig.team_limit || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="results-layout">
                            {/* Teams grid */}
                            <div className="student-groups-container">
                                <div className="groups-grid">
                                    {groups.length > 0 ? (
                                        groups.map((group) => (
                                            <div key={group.number || group.id} className="group-card">
                                                <div className="group-header">
                                                    <span>Group #{group.number || group.id}</span>
                                                </div>
                                                <div className="group-body">
                                                    <div className="group-table-header">
                                                        <div className="group-table-cell">#</div>
                                                        <div className="group-table-cell">ID</div>
                                                        <div className="group-table-cell">Gender</div>
                                                        <div className="group-table-cell">GPA</div>
                                                        <div className="group-table-cell">Commitment</div>
                                                        <div className="group-table-cell">Availability</div>
                                                    </div>
                                                    {group.members && group.members.map((student, idx) => {
                                                        const availability = getStudentAvailability(student);
                                                        const availabilityText = availability.length > 0 
                                                            ? availability.slice(0, 2).join(', ') + (availability.length > 2 ? '...' : '')
                                                            : 'N/A';
                                                        return (
                                                            <div key={idx} className="group-table-row">
                                                                <div className="group-table-cell">{idx + 1}</div>
                                                                <div className="group-table-cell">{student.student_id}</div>
                                                                <div className="group-table-cell">{student.gender}</div>
                                                                <div className="group-table-cell">{student.gpa ? parseFloat(student.gpa).toFixed(2) : 'N/A'}</div>
                                                                <div className="group-table-cell">{student.commitment || 'N/A'}</div>
                                                                <div className="group-table-cell" title={availability.join(', ')}>{availabilityText}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))
                                    ) : students.length > 0 ? (
                                        // If we have students but no groups, display them in groups of 4
                                        Array.from({ length: Math.ceil(students.length / 4) }).map((_, groupIdx) => {
                                            const groupMembers = students.slice(groupIdx * 4, (groupIdx + 1) * 4);
                                            return (
                                                <div key={groupIdx} className="group-card">
                                                    <div className="group-header">
                                                        <span>Group #{groupIdx + 1}</span>
                                                    </div>
                                                    <div className="group-body">
                                                        <div className="group-table-header">
                                                            <div className="group-table-cell">#</div>
                                                            <div className="group-table-cell">ID</div>
                                                            <div className="group-table-cell">Gender</div>
                                                            <div className="group-table-cell">GPA</div>
                                                            <div className="group-table-cell">Commitment</div>
                                                            <div className="group-table-cell">Availability</div>
                                                        </div>
                                                        {groupMembers.map((student, idx) => {
                                                            const availability = getStudentAvailability(student);
                                                            const availabilityText = availability.length > 0 
                                                                ? availability.slice(0, 2).join(', ') + (availability.length > 2 ? '...' : '')
                                                                : 'N/A';
                                                            return (
                                                                <div key={idx} className="group-table-row">
                                                                    <div className="group-table-cell">{idx + 1}</div>
                                                                    <div className="group-table-cell">{student.student_id}</div>
                                                                    <div className="group-table-cell">{student.gender}</div>
                                                                    <div className="group-table-cell">{student.gpa ? parseFloat(student.gpa).toFixed(2) : 'N/A'}</div>
                                                                    <div className="group-table-cell">{student.commitment || 'N/A'}</div>
                                                                    <div className="group-table-cell" title={availability.join(', ')}>{availabilityText}</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="group-card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px'}}>
                                            <p>No student submissions yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        <div className="button-tray smart-teams-button-tray">
                            <button className="button" onClick={() => navigate('/view-surveys')}>
                                Back to Surveys
                            </button>
                            <button className="button" onClick={() => setIsPurgeModalOpen(true)} style={{background: '#dc3545'}}>
                                Purge Data
                            </button>
                        </div>
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