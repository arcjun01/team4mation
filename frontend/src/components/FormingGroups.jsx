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
            console.warn("⚠️ Student object missing id:", student);
            return [];
        }
        const availability = availabilityMap[student.id] || [];
        if (availability.length === 0) {
            console.warn(`⚠️ No availability found for student ID ${student.id}`);
            console.log(`   Available ID keys in map:`, Object.keys(availabilityMap).slice(0, 10));
            console.log(`   Student object:`, student);
        }
        return availability;
    };

    // Helper function to find shared availability between all group members
    const getSharedAvailability = (groupMembers) => {
        if (!groupMembers || groupMembers.length === 0) return [];
        
        console.log(`Finding shared availability for ${groupMembers.length} members...`);
        
        // Get availability for each member
        const availabilities = groupMembers.map((member, idx) => {
            const avail = getStudentAvailability(member);
            console.log(`  Member ${idx} (ID ${member.id}): ${avail.length} slots`, avail.slice(0, 3));
            return new Set(avail);
        });

        // Find intersection of all sets
        let shared = new Set(availabilities[0]);
        for (let i = 1; i < availabilities.length; i++) {
            const before = shared.size;
            shared = new Set([...shared].filter(x => availabilities[i].has(x)));
            console.log(`  After member ${i}: ${before} → ${shared.size} shared slots`);
        }

        console.log(`🎯 Final shared availability: ${shared.size} slots`);
        return Array.from(shared).sort();
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
                } else {
                    console.warn(`⚠️ Config not found for survey ${id} (${response.status}), will continue without config`);
                }
            } catch (error) {
                console.error("Error fetching config:", error);
            }

            try {
                // First try to fetch from the submissions endpoint which returns more complete data
                const submissionsResponse = await fetch(`http://localhost:3001/api/teams/${id}/submissions`);
                console.log(`🔍 Fetching from /api/teams/${id}/submissions...`, submissionsResponse.status);
                
                if (submissionsResponse.ok) {
                    const submissionsData = await submissionsResponse.json();
                    console.log("📋 Submissions data received:", {
                        count: submissionsData.count,
                        students: submissionsData.students?.length || 0,
                        availabilityMapKeys: Object.keys(submissionsData.availabilityMap || {}).length,
                        surveyId: id
                    });

                    // Only use backend data if we don't already have students from location.state
                    const passedStudents = location.state?.names || [];
                    console.log(`📌 Passed students from location.state: ${passedStudents.length}`);
                    
                    if (submissionsData.students && submissionsData.students.length > 0) {
                        // Build student objects from submissions data
                        const builtStudents = submissionsData.students.map((student, idx) => ({
                            id: student.student_id,
                            name: `Student ${idx + 1}`,  // Use ID as name since it's encrypted
                            gender: student.gender || 'N/A',
                            gpa: student.gpa || 0
                        }));
                        setStudents(builtStudents);
                        console.log(`✅ Loaded ${builtStudents.length} students from submissions`);
                        console.log(`   First 3 student IDs:`, builtStudents.slice(0, 3).map(s => s.id));
                    } else if (submissionsData.count === 0) {
                        console.warn(`⚠️ No students found for survey ${id}`);
                    }

                    if (submissionsData.availabilityMap) {
                        console.log(`✅ Availability map loaded with ${Object.keys(submissionsData.availabilityMap).length} students`);
                        console.log(`   First 3 availability keys:`, Object.keys(submissionsData.availabilityMap).slice(0, 3));
                        console.log(`   Sample availability:`, Object.entries(submissionsData.availabilityMap).slice(0, 3));
                        setAvailabilityMap(submissionsData.availabilityMap);
                    }
                    return; // Exit after successfully fetching from submissions endpoint
                } else {
                    console.warn(`⚠️ Submissions endpoint returned ${submissionsResponse.status}, trying teams endpoint...`);
                }

                // Fallback: Fetch availability data from the team generation endpoint
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

                    // If students weren't passed from location.state, build them from available data
                    const passedStudents = location.state?.names || [];
                    if (passedStudents.length === 0 && teamData.studentCount > 0) {
                        console.log("📊 Building students array from backend data...");
                        // Create student objects from the keys in availabilityMap or dummy student IDs
                        const studentIds = Object.keys(teamData.availabilityMap || {});
                        if (studentIds.length > 0) {
                            const builtStudents = studentIds.map((id, idx) => ({
                                id: id,
                                name: `Student ${idx + 1}`,  // Placeholder name using ID
                                gender: 'N/A',
                                gpa: 0
                            }));
                            setStudents(builtStudents);
                            console.log(`✅ Built ${builtStudents.length} student objects from backend data`);
                        }
                    }
                } else {
                    console.error("❌ Failed to fetch team data:", teamResponse.status);
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
                                        <p className="forming-groups-config-value">{surveyConfig.courseName || surveyConfig.course_name || 'N/A'}</p>
                                    </div>
                                    <div className="forming-groups-config-box">
                                        <p className="forming-groups-config-label">Total Submissions</p>
                                        <p className="forming-groups-config-value">{students.length}</p>
                                    </div>
                                    <div className="forming-groups-config-box">
                                        <p className="forming-groups-config-label">Group Size</p>
                                        <p className="forming-groups-config-value">
                                            {(surveyConfig.limitType || surveyConfig.limit_type)
                                                ? ((surveyConfig.limitType || surveyConfig.limit_type) === 'max' ? 'Maximum' : 'Minimum')
                                                : 'Maximum'
                                            }: {surveyConfig.maxSize || surveyConfig.team_limit || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!surveyConfig && (
                            <div className="question-container" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                <p style={{ color: '#666', marginBottom: '10px' }}>Survey configuration not found (Survey ID: {id})</p>
                                <p style={{ color: '#999', fontSize: '12px' }}>Showing student data if available...</p>
                            </div>
                        )}

                        <div className="results-layout">
                            {/* LEFT SIDE: teams grid */}
                            <div className="student-groups-container">
                                {groups.length === 0 ? (
                                    <div className="message-container" style={{ padding: '20px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '16px', color: '#666' }}>
                                            {students.length === 0 
                                                ? `No students found for this survey.` 
                                                : `Forming ${students.length} student${students.length !== 1 ? 's' : ''} into groups...`}
                                        </p>
                                    </div>
                                ) : (
                                <div className="forming-groups-grid">
                                    {groups.map((group) => (
                                        <div key={group.number} className="group-card">
                                                <div className="group-header">
                                                    <span>Group #{group.number}</span>
                                                </div>
                                                <div className="group-body">
                                                    <div className="group-table-header">
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
                                                                <div className="group-table-cell">{student.name}</div>
                                                                <div className="group-table-cell">{student.gender}</div>
                                                                <div className="group-table-cell">{student.gpa ? student.gpa.toFixed(2) : 'N/A'}</div>
                                                                <div className="group-table-cell" title={availability.join(', ')} style={{ whiteSpace: 'pre-wrap' }}>{availabilityText}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="shared-availability-section">
                                                    <div className="shared-availability-label">Shared Availability:</div>
                                                    <div className="shared-availability-content">
                                                        {(() => {
                                                            const shared = getSharedAvailability(group.members);
                                                            if (shared.length === 0) {
                                                                return "No common times";
                                                            }
                                                            return formatAvailabilityRanges(shared);
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                    ))}
                                </div>
                                )}
                            </div>

                            {/* RIGHT SIDE: Using the stats sidebar container for action buttons */}
                            <div className="stats-card-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '100px', alignItems: 'center' }}>
                                {/* SCRUM-240: Added Preview button to navigate to student-view page */}
                                <button 
                                    className="sidebar-btn" 
                                    onClick={() => navigate(`/student-view/teams/${id}`, { state: { groups } })}
                                    title="Preview Student View"
                                    style={{ padding: '12px', width: '100%' }}
                                >
                                    <span className="icon">View 👁️</span>
                                </button>
                                
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