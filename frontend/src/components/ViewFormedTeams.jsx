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
                        {/* Cards will go here */}
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