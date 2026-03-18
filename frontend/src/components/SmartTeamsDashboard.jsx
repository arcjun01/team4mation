import React, { useState } from 'react';
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

                    <div className="results-layout">
                        {/* LEFT SIDE: teams grid */}
                        <div className="student-list-container">
                            <div className="groups-grid" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(2, 1fr)', 
                                gap: '20px', 
                                width: '100%' 
                            }}>
                                {groups.map((group) => (
                                    <div key={group.number} className="group-card">
                                        <div className="group-header">
                                            <span>Group #{group.number}</span>
                                        </div>
                                        <div className="group-body">
                                            {group.members.map((student, idx) => (
                                                <div key={idx} className="member-row">
                                                    <span className="member-name">{student.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDE: Using the stats sidebar container for action buttons */}
                        <div className="stats-card-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '100px', alignItems: 'center' }}>
                            <button className="sidebar-btn" title="Export" style={{ padding: '12px', width: '100%' }}>
                                <span className="icon">Share 📤</span>
                            </button>
                            <button className="sidebar-btn" title="Reshuffle" style={{ padding: '12px', width: '100%' }}>
                                <span className="icon">Shuffle 🔄</span> 
                            </button>
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