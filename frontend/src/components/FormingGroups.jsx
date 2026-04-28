import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import PurgeModal from "./PurgeModal";
import '../css/FormingGroups.css'; 

const FormingGroups = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Receiving names from the previous page state, or we'll fetch from backend
    const [students, setStudents] = useState(location.state?.names || []);
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [isPurging, setIsPurging] = useState(false);
    const [surveyConfig, setSurveyConfig] = useState(null);
    const [availabilityMap, setAvailabilityMap] = useState({});

    // Helper function to get availability for a student
    const getStudentAvailability = (student) => {
        if (!student || !student.id) {
            return [];
        }
        return availabilityMap[student.id] || [];
    };

    // Helper function to find shared availability between all group members
    const getSharedAvailability = (groupMembers) => {
        // Fix: Ensure we only attempt calculation if we have actual data in the map
        if (!groupMembers || groupMembers.length === 0 || Object.keys(availabilityMap).length === 0) return [];
        
        const availabilities = groupMembers.map((member) => {
            const avail = getStudentAvailability(member);
            return new Set(avail);
        });

        let shared = new Set(availabilities[0]);
        for (let i = 1; i < availabilities.length; i++) {
            shared = new Set([...shared].filter(x => availabilities[i].has(x)));
        }

        return Array.from(shared).sort();
    };

    // Helper function to format consecutive times into ranges
    const formatAvailabilityRanges = (availabilityArray) => {
        if (!availabilityArray || availabilityArray.length === 0) return 'N/A';

        const timeToNumber = (timeStr) => {
            const match = timeStr.match(/(\d+)\s+(AM|PM)/);
            if (!match) return null;
            let hour = parseInt(match[1]);
            const period = match[2];
            if (period === 'AM') { if (hour === 12) hour = 0; } 
            else { if (hour !== 12) hour += 12; }
            return hour;
        };

        const extractHourAndPeriod = (timeStr) => {
            const match = timeStr.match(/(\d+)\s+(AM|PM)/);
            if (!match) return { hour: null, period: null };
            return { hour: parseInt(match[1]), period: match[2] };
        };

        const parseSlot = (slot) => {
            const lastDashIndex = slot.lastIndexOf('-');
            const day = slot.substring(0, lastDashIndex).trim();
            const time = slot.substring(lastDashIndex + 1).trim();
            const hour = timeToNumber(time);
            return { day, time, hour };
        };

        const byDay = {};
        for (const slot of availabilityArray) {
            const parsed = parseSlot(slot);
            if (!byDay[parsed.day]) byDay[parsed.day] = [];
            byDay[parsed.day].push(parsed);
        }

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
                    rangeEnd = slots[i];
                } else {
                    if (rangeStart.hour === rangeEnd.hour) {
                        dayTimes.push(rangeStart.time);
                    } else {
                        const startHP = extractHourAndPeriod(rangeStart.time);
                        const endHP = extractHourAndPeriod(rangeEnd.time);
                        dayTimes.push(startHP.period === endHP.period 
                            ? `${startHP.hour}-${endHP.hour} ${endHP.period}`
                            : `${startHP.hour} ${startHP.period}-${endHP.hour} ${endHP.period}`);
                    }
                    rangeStart = slots[i];
                    rangeEnd = slots[i];
                }
            }
            if (rangeStart.hour === rangeEnd.hour) {
                dayTimes.push(rangeStart.time);
            } else {
                const startHP = extractHourAndPeriod(rangeStart.time);
                const endHP = extractHourAndPeriod(rangeEnd.time);
                dayTimes.push(startHP.period === endHP.period 
                    ? `${startHP.hour}-${endHP.hour} ${endHP.period}`
                    : `${startHP.hour} ${startHP.period}-${endHP.hour} ${endHP.period}`);
            }
            results.push(`${day}: ${dayTimes.join(', ')}.`);
        }
        return results.join('\n');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/config/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSurveyConfig(data);
                }
            } catch (error) {
                console.error("Error fetching config:", error);
            }

            try {
                const submissionsResponse = await fetch(`http://localhost:3001/api/teams/${id}/submissions`);
                if (submissionsResponse.ok) {
                    const submissionsData = await submissionsResponse.json();
                    
                    // START OF DECRYPTION FIX: Prioritize names from location.state
                    const passedStudents = location.state?.names || [];
                    
                    if (submissionsData.students && submissionsData.students.length > 0) {
                        const builtStudents = submissionsData.students.map((student, idx) => {
                            // Find the decrypted name that matches this ID
                            const decryptedMatch = passedStudents.find(ps => ps.id === student.student_id);
                            return {
                                id: student.student_id,
                                name: decryptedMatch ? decryptedMatch.name : `Student ${idx + 1}`,
                                gender: student.gender || 'N/A',
                                gpa: student.gpa || 0,
                                availability: submissionsData.availabilityMap ? submissionsData.availabilityMap[student.student_id] : []
                            };
                        });
                        setStudents(builtStudents);
                    }

                    if (submissionsData.availabilityMap) {
                        setAvailabilityMap(submissionsData.availabilityMap);
                    }
                    return; 
                }

                // Fallback for teams endpoint
                const teamResponse = await fetch(`http://localhost:3001/api/teams/${id}`);
                if (teamResponse.ok) {
                    const teamData = await teamResponse.json();
                    if (teamData.availabilityMap) setAvailabilityMap(teamData.availabilityMap);

                    const passedStudents = location.state?.names || [];
                    if (passedStudents.length === 0 && teamData.studentCount > 0) {
                        const studentIds = Object.keys(teamData.availabilityMap || {});
                        const builtStudents = studentIds.map((id, idx) => ({
                            id: id,
                            name: `Student ${idx + 1}`,
                            gender: 'N/A',
                            gpa: 0,
                            availability: teamData.availabilityMap[id] || []
                        }));
                        setStudents(builtStudents);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [id, location.state]);

    const groups = [];
    for (let i = 0; i < students.length; i += 4) {
        groups.push({
            number: (i / 4) + 1,
            members: students.slice(i, i + 4)
        });
    }

    const handlePurge = async () => {
        setIsPurging(true);
        try {
            const response = await fetch(`http://localhost:3001/api/survey/purge/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setIsPurgeModalOpen(false);
                navigate(`/survey-submissions/${id}`, { state: { names: [] } });
            }
        } catch (error) {
            console.error("Purge Error:", error);
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

                        {surveyConfig && (
                            <div className="question-container forming-groups-config-section">
                                <div className="forming-groups-config-grid">
                                    <div className="forming-groups-config-box">
                                        <p className="forming-groups-config-label">Class Name</p>
                                        <p className="forming-groups-config-value">{surveyConfig.courseName || surveyConfig.course_name || 'N/A'}</p>
                                    </div>
                                    <div className="forming-groups-config-box">
                                        <p className="forming-groups-config-label">Total Submissions</p>
                                        <p className="forming-groups-config-value">{students.length}</p>
                                    </div>
                                    <div className="forming-groups-config-box">
                                        <p className="forming-groups-config-label">Group Size</p>
                                        <p className="forming-groups-config-value">
                                            {(surveyConfig.limitType || surveyConfig.limit_type) === 'max' ? 'Maximum' : 'Minimum'}: {surveyConfig.maxSize || surveyConfig.team_limit || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="results-layout">
                            <div className="student-groups-container">
                                <div className="forming-groups-grid">
                                    {groups.map((group) => (
                                        <div key={group.number} className="group-card">
                                            <div className="group-header"><span>Group #{group.number}</span></div>
                                            <div className="group-body">
                                                <div className="group-table-header">
                                                    <div className="group-table-cell">Name</div>
                                                    <div className="group-table-cell">Gender</div>
                                                    <div className="group-table-cell">GPA</div>
                                                    <div className="group-table-cell">Availability</div>
                                                </div>
                                                {group.members.map((student, idx) => {
                                                    const availability = getStudentAvailability(student);
                                                    return (
                                                        <div key={idx} className="group-table-row">
                                                            <div className="group-table-cell">{student.name}</div>
                                                            <div className="group-table-cell">{student.gender}</div>
                                                            <div className="group-table-cell">{student.gpa ? student.gpa.toFixed(2) : 'N/A'}</div>
                                                            <div className="group-table-cell" style={{ whiteSpace: 'pre-wrap' }}>
                                                                {formatAvailabilityRanges(availability)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="shared-availability-section">
                                                <div className="shared-availability-label">Shared Availability:</div>
                                                <div className="shared-availability-content">
                                                    {/* Fix: Re-calculate shared availability based on the map state */}
                                                    {Object.keys(availabilityMap).length > 0 
                                                        ? formatAvailabilityRanges(getSharedAvailability(group.members)) 
                                                        : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SIDEBAR - All original inline styles preserved exactly */}
                            <div className="stats-card-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '100px', alignItems: 'center' }}>
                                <button 
                                    className="sidebar-btn" 
                                    onClick={() => {
                                        const previewUrl = `/team4mation/student-view/teams/${id}`;
                                        // Save the decrypted student objects to localStorage so the new tab can access them
                                        localStorage.setItem(`preview_data_${id}`, JSON.stringify(students));
                                        window.open(previewUrl, '_blank');
                                    }}
                                    style={{ padding: '12px', width: '100%' }}
                                >
                                    <span className="icon">View 👁️</span>
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