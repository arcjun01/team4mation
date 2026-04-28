import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import '../css/FormingGroups.css';

const ViewFormedTeams = () => {
    const { id } = useParams();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

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
        
        const availabilities = groupMembers.map((member) => {
            return new Set(member.availability || []);
        });

        let shared = new Set(availabilities[0]);
        for (let i = 1; i < availabilities.length; i++) {
            shared = new Set([...shared].filter(x => availabilities[i].has(x)));
        }

        return Array.from(shared).sort();
    };

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const savedData = localStorage.getItem(`preview_data_${id}`);
                let studentArray = [];

                if (savedData) {
                    studentArray = JSON.parse(savedData);
                } else {
                    const response = await fetch(`http://localhost:3001/api/teams/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        studentArray = Object.keys(data.availabilityMap || {}).map((studentId, idx) => ({
                            id: studentId,
                            name: `Student ${idx + 1}`,
                            gender: 'N/A',
                            gpa: 0,
                            availability: data.availabilityMap[studentId] || []
                        }));
                    }
                }

                const grouped = [];
                for (let i = 0; i < studentArray.length; i += 4) {
                    grouped.push({
                        number: (i / 4) + 1,
                        members: studentArray.slice(i, i + 4)
                    });
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
                                                <div className="group-table-cell" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {formatAvailabilityRanges(student.availability)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="shared-availability-section" style={{ backgroundColor: '#e0f2f1' }}>
                                        <div className="shared-availability-label">Shared Meeting Times:</div>
                                        <div className="shared-availability-content">
                                            {formatAvailabilityRanges(getSharedAvailability(group.members))}
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