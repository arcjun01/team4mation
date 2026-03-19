import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import PurgeModal from "./PurgeModal";
import '../css/FormingGroups.css'; 

const FormingGroups = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // State for students, teams, and submissions
    const [students, setStudents] = useState(location.state?.names || []);
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [isPurging, setIsPurging] = useState(false);
    const [surveyConfig, setSurveyConfig] = useState(null);
    const [availabilityMap, setAvailabilityMap] = useState({});

    // Helper function to get availability for a student
    const getStudentAvailability = (student) => {
        if (!student || !student.student_id) {
            console.warn("⚠️ Student object missing student_id:", student);
            return [];
        }
        const availability = availabilityMap[student.student_id] || [];
        if (availability.length === 0 && Object.keys(availabilityMap).length > 0) {
            // Only warn if we have availability data for other students
            console.warn(`⚠️ No availability found for student ID ${student.student_id}. Available ID keys:`, Object.keys(availabilityMap).slice(0, 5));
        }
        return availability;
    };

    // Helper function to format consecutive times into ranges (e.g., "TUE: 9-10 AM, 12 PM")
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

        // Extract hour and period from time string like "9 AM"
        const extractHourAndPeriod = (timeStr) => {
            const match = timeStr.match(/(\d+)\s+(AM|PM)/);
            if (!match) return { hour: null, period: null };
            return { hour: parseInt(match[1]), period: match[2] };
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

        // Format each day's slots into compact format with all times on one line
        const results = [];
        const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        
        for (const day of dayOrder) {
            if (!byDay[day]) continue;
            
            const slots = byDay[day].sort((a, b) => a.hour - b.hour);
            const dayTimes = [];
            let rangeStart = slots[0];
            let rangeEnd = slots[0];

            for (let i = 1; i < slots.length; i++) {
                if (slots[i].hour === rangeEnd.hour + 1) {
                    // Consecutive hour
                    rangeEnd = slots[i];
                } else {
                    // Gap found, save the range
                    if (rangeStart.hour === rangeEnd.hour) {
                        dayTimes.push(rangeStart.time);
                    } else {
                        // Format as "9-10 AM" or "9 AM-12 PM" if periods differ
                        const startHourPeriod = extractHourAndPeriod(rangeStart.time);
                        const endHourPeriod = extractHourAndPeriod(rangeEnd.time);
                        if (startHourPeriod.period === endHourPeriod.period) {
                            dayTimes.push(`${startHourPeriod.hour}-${endHourPeriod.hour} ${endHourPeriod.period}`);
                        } else {
                            dayTimes.push(`${startHourPeriod.hour} ${startHourPeriod.period}-${endHourPeriod.hour} ${endHourPeriod.period}`);
                        }
                    }
                    rangeStart = slots[i];
                    rangeEnd = slots[i];
                }
            }

            // Add the last range
            if (rangeStart.hour === rangeEnd.hour) {
                dayTimes.push(rangeStart.time);
            } else {
                // Format as "9-10 AM" or "9 AM-12 PM" if periods differ
                const startHourPeriod = extractHourAndPeriod(rangeStart.time);
                const endHourPeriod = extractHourAndPeriod(rangeEnd.time);
                if (startHourPeriod.period === endHourPeriod.period) {
                    dayTimes.push(`${startHourPeriod.hour}-${endHourPeriod.hour} ${endHourPeriod.period}`);
                } else {
                    dayTimes.push(`${startHourPeriod.hour} ${startHourPeriod.period}-${endHourPeriod.hour} ${endHourPeriod.period}`);
                }
            }

            // Format as "DAY: time1, time2, etc."
            results.push(`${day}: ${dayTimes.join(', ')}.`);
        }

        return results.join('\n');
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

                // Fetch students if not provided via navigation state
                if (students.length === 0) {
                    const submissionsResponse = await fetch(`http://localhost:3001/api/surveys/${id}/submissions`);
                    if (submissionsResponse.ok) {
                        const submissionsData = await submissionsResponse.json();
                        setStudents(submissionsData.students || []);
                        setAvailabilityMap(submissionsData.availabilityMap || {});
                        console.log("✅ Students fetched:", submissionsData.students.length);
                    } else {
                        console.error("❌ Failed to fetch students:", submissionsResponse.status);
                    }
                } else {
                    // If students were passed via location state, fetch just the availability map
                    const submissionsResponse = await fetch(`http://localhost:3001/api/surveys/${id}/submissions`);
                    if (submissionsResponse.ok) {
                        const submissionsData = await submissionsResponse.json();
                        setAvailabilityMap(submissionsData.availabilityMap || {});
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
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
                            <h1>Forming Groups</h1>
                        </div>

                        {/* Survey Configuration Details */}
                        {surveyConfig && (
                            <div className="question-container forming-groups-config-section">
                                <div className="forming-groups-config-grid">
                                    <div className="forming-groups-config-box">
                                        <p className="forming-groups-config-label">Class Name</p>
                                        <p className="forming-groups-config-value">{surveyConfig.courseName || 'N/A'}</p>
                                    </div>
                                    <div className="forming-groups-config-box">
                                        <p className="forming-groups-config-label">Total Submissions</p>
                                        <p className="forming-groups-config-value">{students.length}</p>
                                    </div>
                                    <div className="forming-groups-config-box">
                                        <p className="forming-groups-config-label">Group Size</p>
                                        <p className="forming-groups-config-value">{surveyConfig.limitType || 'Maximum'}: {surveyConfig.maxSize || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="results-layout">
                            {/* LEFT SIDE: teams grid */}
                            <div className="student-groups-container">
                                <div className="forming-groups-grid">
                                    {groups.map((group) => (
                                        <div key={group.number} className="group-card">
                                            <div className="group-header">
                                                <span>Group #{group.number}</span>
                                            </div>
                                            <div className="group-body">
                                                <div className="group-table-header">
                                                    <div className="group-table-cell">Student ID</div>
                                                    <div className="group-table-cell">Gender</div>
                                                    <div className="group-table-cell">GPA</div>
                                                    <div className="group-table-cell">Availability</div>
                                                </div>
                                                {group.members.map((student) => {
                                                    const availability = getStudentAvailability(student);
                                                    const availabilityText = formatAvailabilityRanges(availability);
                                                    return (
                                                        <div key={student.student_id} className="group-table-row">
                                                            <div className="group-table-cell">{student.student_id}</div>
                                                            <div className="group-table-cell">{student.gender}</div>
                                                            <div className="group-table-cell">{student.gpa ? student.gpa.toFixed(2) : 'N/A'}</div>
                                                            <div className="group-table-cell" title={availability.join(', ')} style={{ whiteSpace: 'pre-wrap' }}>{availabilityText}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="button-tray forming-groups-button-tray">
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

export default FormingGroups;