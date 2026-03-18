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
        if (!student || !student.id) {
            console.warn("⚠️ Student object missing id:", student);
            return [];
        }
        const availability = availabilityMap[student.id] || [];
        if (availability.length === 0 && Object.keys(availabilityMap).length > 0) {
            // Only warn if we have availability data for other students
            console.warn(`⚠️ No availability found for student ID ${student.id}. Available ID keys:`, Object.keys(availabilityMap).slice(0, 5));
        }
        return availability;
    };

    // Helper function to format consecutive times into ranges (e.g., "THU 3 PM - 8 PM")
    const formatAvailabilityRanges = (availabilityArray) => {
        if (!availabilityArray || availabilityArray.length === 0) return 'N/A';

        // Convert time string to numeric hour (0-23)
        const timeToNumber = (timeStr) => {
            const match = timeStr.match(/(\d+)\s+(AM|PM)/);
            if (!match) return null;
            let hour = parseInt(match[1]);
            const period = match[2];
            
            if (period === 'AM') {
                if (hour === 12) hour = 0; // 12 AM is 0
            } else {
                if (hour !== 12) hour += 12; // 1 PM is 13, etc.
            }
            return hour;
        };

        // Parse a slot like "MON-9 AM"
        const parseSlot = (slot) => {
            const lastDashIndex = slot.lastIndexOf('-');
            const day = slot.substring(0, lastDashIndex).trim();
            const time = slot.substring(lastDashIndex + 1).trim();
            const hour = timeToNumber(time);
            return { day, time, hour };
        };

        // Group slots by day
        const byDay = {};
        for (const slot of availabilityArray) {
            const parsed = parseSlot(slot);
            if (!byDay[parsed.day]) {
                byDay[parsed.day] = [];
            }
            byDay[parsed.day].push(parsed);
        }

        // Format each day's slots into ranges
        const results = [];
        const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        
        for (const day of dayOrder) {
            if (!byDay[day]) continue;
            
            const slots = byDay[day].sort((a, b) => a.hour - b.hour);
            let rangeStart = slots[0];
            let rangeEnd = slots[0];

            for (let i = 1; i < slots.length; i++) {
                if (slots[i].hour === rangeEnd.hour + 1) {
                    // Consecutive hour
                    rangeEnd = slots[i];
                } else {
                    // Gap found, save the range
                    if (rangeStart.hour === rangeEnd.hour) {
                        results.push(`${day} ${rangeStart.time}`);
                    } else {
                        results.push(`${day} ${rangeStart.time} - ${rangeEnd.time}`);
                    }
                    rangeStart = slots[i];
                    rangeEnd = slots[i];
                }
            }

            // Add the last range
            if (rangeStart.hour === rangeEnd.hour) {
                results.push(`${day} ${rangeStart.time}`);
            } else {
                results.push(`${day} ${rangeStart.time} - ${rangeEnd.time}`);
            }
        }

        return results.join(', ');
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
                    console.log("🔍 Team data received:", {
                        studentCount: teamData.studentCount,
                        availabilityMapKeys: Object.keys(teamData.availabilityMap || {}).length,
                        availabilityMapSample: Object.entries(teamData.availabilityMap || {}).slice(0, 3)
                    });
                    
                    if (teamData.availabilityMap) {
                        console.log("✅ Availability map found with", Object.keys(teamData.availabilityMap).length, "students");
                        setAvailabilityMap(teamData.availabilityMap);
                    } else {
                        console.warn("⚠️ No availability map in response");
                    }
                } else {
                    console.error("❌ Failed to fetch team data:", teamResponse.status);
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
                                        <p className="config-value">{surveyConfig.limitType || 'Maximum'}: {surveyConfig.maxSize || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="results-layout">
                            {/* LEFT SIDE: teams grid */}
                            <div className="student-groups-container">
                                <div className="groups-grid">
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
                                                    const availabilityText = formatAvailabilityRanges(availability);
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

                        </div>

                        <div className="button-tray smart-teams-button-tray">
                            <button className="button" onClick={() => navigate(-1)}>
                                Back to Submissions
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