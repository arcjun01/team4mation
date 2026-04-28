import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import '../css/FormingGroups.css';

const ViewFormedTeams = () => {
    const { id } = useParams();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/teams/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    const studentArray = Object.keys(data.availabilityMap || {}).map((studentId, idx) => ({
                        id: studentId,
                        name: `Student ${idx + 1}`,
                        gender: 'N/A',
                        gpa: 0
                    }));

                    const grouped = [];
                    for (let i = 0; i < studentArray.length; i += 4) {
                        grouped.push({
                            number: (i / 4) + 1,
                            members: studentArray.slice(i, i + 4)
                        });
                    }
                    setGroups(grouped);
                }
            } catch (error) {
                console.error("Error loading preview:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, [id]);

    return (
        <>
            <Header variant="page" />
            <div className="survey-page-wrapper top-gap">
                <div className="main-container">
                    <div className="content-container">
                        <div className="question-container" style={{ textAlign: 'center' }}>
                            <h1>Formed Teams Preview</h1>
                        </div>

                        <div className="forming-groups-grid">
                            {groups.map((group) => (
                                <div key={group.number} className="group-card">
                                    <div className="group-header">
                                        <span>Group #{group.number}</span>
                                    </div>
                                    <div className="group-body">
                                        <div className="group-table-header">
                                            <div className="group-table-cell">Name</div>
                                            <div className="group-table-cell">Availability</div>
                                        </div>
                                        {group.members.map((student, idx) => (
                                            <div key={idx} className="group-table-row">
                                                <div className="group-table-cell">{student.name}</div>
                                                <div className="group-table-cell">
                                                    Standard Class Times
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="shared-availability-section" style={{ backgroundColor: '#e0f2f1' }}>
                                        <div className="shared-availability-label">Shared Meeting Times:</div>
                                        <div className="shared-availability-content">
                                            TUE: 9-11 AM, THU: 2-4 PM
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="button-tray" style={{ justifyContent: 'center', marginTop: '30px' }}>
                            <button className="button" onClick={() => window.close()}>
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewFormedTeams;