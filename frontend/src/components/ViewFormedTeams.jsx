import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import '../css/FormingGroups.css';

const ViewFormedTeams = () => {
    const { id } = useParams();
    const [groups, setGroups] = useState([]);
    const [surveyConfig, setSurveyConfig] = useState(null);
    const [, setLoading] = useState(true);
    const shouldShowAvailability = !(surveyConfig?.availability_optional ?? surveyConfig?.availabilityOptional);
    const formatSubmissionTimestamp = (timestampValue) => {
        if (!timestampValue) return 'Submission time unavailable';
        const date = new Date(timestampValue);
        if (Number.isNaN(date.getTime())) return 'Submission time unavailable';
        return `Submitted: ${date.toLocaleString()}`;
    };

    // Helper function to format consecutive times into ranges (copied from FormingGroups for consistency)
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

    // Helper function to find shared availability between all group members
    const getSharedAvailability = (groupMembers) => {
        if (!groupMembers || groupMembers.length === 0) return [];

        // Only use members that have availability entries
        const availabilityLists = groupMembers
            .map((m) => m.availability || [])
            .filter((arr) => Array.isArray(arr) && arr.length > 0);

        if (availabilityLists.length === 0) return [];

        let shared = new Set(availabilityLists[0]);
        for (let i = 1; i < availabilityLists.length; i++) {
            const nextSet = new Set(availabilityLists[i]);
            shared = new Set([...shared].filter(x => nextSet.has(x)));
            if (shared.size === 0) return [];
        }

        return Array.from(shared).sort();
    };

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const configResponse = await fetch(`/api/config/${id}`);
                if (configResponse.ok) {
                    setSurveyConfig(await configResponse.json());
                }

                const savedData = localStorage.getItem(`preview_data_${id}`);
                let studentArray = [];
                let grouped = [];

                if (savedData) {

// Resolve Logic: Use main's robust parsing and prefix handling
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        // Check if the data is wrapped in a 'groups' object (from the View button logic)
                        if (parsed?.groups && Array.isArray(parsed.groups)) {
                            setGroups(parsed.groups);
                            setLoading(false);
                            return;
                        }
                        // Check if it's wrapped in a 'students' object or is a raw array
                        if (parsed?.students && Array.isArray(parsed.students)) {
                            studentArray = parsed.students;
                        } else if (Array.isArray(parsed)) {
                            studentArray = parsed;
                        }
                    } catch (e) {
                        console.error('Error parsing preview data:', e);
                    }
                } else {
                    // Robust API fetching with path prefix support
                    const prefixes = [
                        '',
                        window.location.pathname.startsWith('/team4mation') ? '/team4mation' : ''
                    ].filter((v, i, a) => a.indexOf(v) === i);

                    let data = null;
                    for (const p of prefixes) {
                        try {
                            const url = `${p}/api/teams/${id}`;
                            const response = await fetch(url);
                            if (response.ok) {
                                data = await response.json();
                                break;
                            }
                        } catch (e) { /* try next prefix */ }
                    }

                    if (data) {
                        // If API returned existing teams, map them using the feature's specific fields
                        if (Array.isArray(data.teams) && data.teams.length > 0) {
                            const built = data.teams.map((team, idx) => ({
                                number: idx + 1,
                                members: team.map((s, mIdx) => ({
                                    id: s.student_id,
                                    name: s.name || `Student ${mIdx + 1}`, // Preserve name if available
                                    gender: s.gender || 'N/A',
                                    gpa: s.gpa || 0,
                                    availability: (data.availabilityMap && data.availabilityMap[s.student_id]) || [],
                                    created_at: s.created_at || null
                                }))
                            }));
                            setGroups(built);
                            setLoading(false);
                            return;
                        }

                        // Fallback: Map raw availability map to student array
                        studentArray = Object.keys(data.availabilityMap || {}).map((studentId, idx) => ({
                            id: studentId,
                            name: `Student ${idx + 1}`,
                            gender: 'N/A',
                            gpa: 0,
                            availability: data.availabilityMap[studentId] || []
                        }));
                    }
                }

                if (grouped.length === 0 && studentArray.length > 0) {
                    for (let i = 0; i < studentArray.length; i += 4) {
                        grouped.push({
                            number: (i / 4) + 1,
                            members: studentArray.slice(i, i + 4)
                        });
                    }
                }
                setGroups(grouped);
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
            <Header />
            <div className="survey-page-wrapper top-gap">
                <div className="main-container">
                    <div className="content-container">
                        <div className="question-container" style={{ textAlign: 'center' }}>
                            <h1>Formed Teams Preview</h1>
                        </div>

                        <div className={`forming-groups-grid ${!shouldShowAvailability ? 'compact-grid' : ''}`}>
                            {groups.map((group) => (
                                <div key={group.number} className={`group-card ${!shouldShowAvailability ? 'compact-group-card' : ''}`}>
                                    <div className="group-header">
                                        <span>Group #{group.number}</span>
                                    </div>
                                    <div className="group-body">
                                        <div className={`group-table-header ${shouldShowAvailability ? 'two-col' : 'one-col'}`}>
                                            <div className="group-table-cell">Name</div>
                                            {shouldShowAvailability && <div className="group-table-cell">Availability</div>}
                                        </div>
                                        {group.members.map((student, idx) => (
                                            <div key={idx} className={`group-table-row ${shouldShowAvailability ? 'two-col' : 'one-col'}`}>
                                                <div className="group-table-cell" title={formatSubmissionTimestamp(student.created_at)}>{student.name}</div>
                                                {shouldShowAvailability && (
                                                    <div className="group-table-cell" style={{ whiteSpace: 'pre-wrap' }}>
                                                        {formatAvailabilityRanges(student.availability)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {shouldShowAvailability && (
                                        <div className="shared-availability-section" style={{ backgroundColor: '#e0f2f1' }}>
                                            <div className="shared-availability-label">Shared Meeting Times:</div>
                                            <div className="shared-availability-content">
                                                {formatAvailabilityRanges(getSharedAvailability(group.members))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="button-tray" style={{ justifyContent: 'flex-end', marginTop: '30px' }}>
                            <button className="button" onClick={() => window.close()}>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewFormedTeams;
